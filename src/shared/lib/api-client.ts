import { z } from 'zod';
import { config } from './config';
import { apiSafetyNet } from './api-safety-net';

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
    validationErrors?: Record<string, string>;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

const METADATA_KEYS = [
    'success',
    'message',
    'data',
    'items',
    'results',
    'nodes',
    'users',
    'products',
    'error',
    'errors',
    'limit',
    'page',
    'total',
    'totalPages',
    'total_pages',
    'count',
    'pagination',
    'totalCount',
    'total_count',
    'pageSize',
    'page_size',
    'current_page',
    'per_page',
    'statusCode',
    'timestamp',
    'meta',
];

const DATA_KEYS = ['data', 'items', 'results', 'nodes', 'users', 'products'] as const;

// Helper to safely check if a value is a record
const isRecord = (val: unknown): val is Record<string, unknown> => !!val && typeof val === 'object' && !Array.isArray(val);

class ApiClient {
    private baseUrl: string;
    private isRefreshing: boolean = false;
    private refreshPromise: Promise<boolean> | null = null;

    constructor() {
        this.baseUrl = config.apiBaseUrl;
    }

    private getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    private async refreshAccessToken(): Promise<boolean> {
        // Prevent multiple simultaneous refresh attempts
        if (this.isRefreshing) {
            return this.refreshPromise || Promise.resolve(false);
        }

        this.isRefreshing = true;
        this.refreshPromise = this.performRefresh();

        try {
            const success = await this.refreshPromise;
            return success;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    /**
     * Perform refresh token flow: POST /auth/refresh with refreshToken in body.
     * Always overwrite both tokens with new values from response.
     * If refresh fails, clear tokens and redirect to login.
     */
    private async performRefresh(): Promise<boolean> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return false;
        }

        try {
            const url = `${this.baseUrl}/auth/refresh`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();
            // Unwrap { data: { ... } } if present
            const responseData = data && typeof data === 'object' && 'data' in data ? data.data : data;

            if (!response.ok) {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
                localStorage.setItem('session_expired', '1');
                window.location.href = '/login';
                return false;
            }

            // Always overwrite both tokens with new values
            if (responseData.accessToken) {
                localStorage.setItem('auth_token', responseData.accessToken);
            }
            if (responseData.refreshToken) {
                localStorage.setItem('refresh_token', responseData.refreshToken);
            }

            return true;
        } catch {
            // Network or other error - redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.setItem('session_expired', '1');
            window.location.href = '/login';
            return false;
        }
    }

    /**
     * Unified response parsing and "smart unwrap" logic.
     * Extracts inner data from standard backend response wrappers.
     */
    private async parseResponseData(response: Response): Promise<{ data: unknown; responseData: unknown }> {
        let data: unknown;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                data = await response.json();
            } catch {
                data = null;
            }
        } else {
            // Handle non-JSON responses (e.g. 204 No Content or error pages)
            try {
                const text = await response.text();
                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }
            } catch {
                data = null;
            }
        }

        let responseData = data;

        // Perform smart unwrapping
        while (isRecord(responseData)) {
            const currentResponse = responseData;
            const keys = Object.keys(currentResponse);

            // Only unwrap if the object exclusively contains metadata or data keys
            if (keys.length > 0 && keys.every((key) => METADATA_KEYS.includes(key))) {
                const dataKey = DATA_KEYS.find((key) => key in currentResponse);
                if (dataKey) {
                    const innerData = currentResponse[dataKey];
                    if (innerData !== currentResponse) {
                        responseData = innerData;
                        continue;
                    }
                }
            }
            break;
        }

        return { data, responseData };
    }

    private async request<T>(endpoint: string, options: RequestInit = {}, schema?: z.ZodType<T>): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const isFormData = options.body instanceof FormData;
        const headers: HeadersInit = {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...options.headers,
        };

        const token = this.getAuthToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        // Safety Net check
        if (!apiSafetyNet.shouldAttempt(endpoint)) {
            const coolingDown = apiSafetyNet.getCoolDownRemaining(endpoint);
            const error: ApiError = {
                message: `[SafetyNet] Request to ${endpoint} blocked. Cooling down for ${coolingDown}s.`,
                statusCode: 429, // Too Many Requests
            };
            throw error;
        }

        let response: Response;
        try {
            response = await fetch(url, { ...options, headers });
        } catch (fetchErr) {
            // Network connectivity issues
            const error: ApiError = {
                message: `Network error reaching ${endpoint}`,
                statusCode: 0,
            };
            apiSafetyNet.recordFailure(endpoint, error);
            throw error;
        }

        /**
         * NOTE: The response data type is dynamic and can be either JSON or text.
         * We use unknown to maintain strict type safety per protocol.
         */
        let { data, responseData } = await this.parseResponseData(response);

        // If 401, try to refresh token and retry
        if (response.status === 401) {
            const refreshed = await this.refreshAccessToken();

            if (refreshed) {
                // Retry requested logic
                const newToken = this.getAuthToken();
                const retryHeaders: HeadersInit = {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...options.headers,
                };

                if (newToken) {
                    (retryHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
                }

                response = await fetch(url, { ...options, headers: retryHeaders });
                
                // Reparse the new response after retry
                const updated = await this.parseResponseData(response);
                data = updated.data;
                responseData = updated.responseData;
            }
        }

        if (response.ok) {
            apiSafetyNet.recordSuccess(endpoint);

            // Strict Zod Validation
            if (schema) {
                const result = schema.safeParse(responseData);
                if (!result.success) {
                    const validationDetails = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');

                    const message = `[Zod Mismatch] ${endpoint}: ${validationDetails}`;
                    console.error(message, {
                        expected: schema._zod,
                        received: responseData,
                    });

                    // Per protocol: throw error on any validation mismatch
                    const zodError: ApiError = {
                        message: `Data integrity error: The server response did not match the expected format. Details: ${validationDetails}`,
                        statusCode: 422, // Unprocessable Entity
                        error: 'Validation Error',
                    };
                    throw zodError;
                }
                return result.data;
            }

            return responseData as T;
        }

        // Error handling
        const dataRecord = isRecord(data) ? data : {};
        const responseDataRecord = isRecord(responseData) ? responseData : {};
        
        let extractedMessage = String(dataRecord.message || 'An error occurred');
        let validationErrors: Record<string, string> | undefined;

        // Clean architecture: Centralize validation error parsing for all API requests
        const rawErrors = dataRecord.errors || responseDataRecord.errors;
        const errorsArray = Array.isArray(rawErrors) ? (rawErrors as unknown[]) : [];
        
        if (errorsArray.length > 0) {
            validationErrors = {};
            
            // Helper to safely check error shape without 'any'
            const isErrorObj = (err: unknown): err is { path: string[]; message?: string } => 
                !!err && typeof err === 'object' && 'path' in err && Array.isArray((err as Record<string, unknown>).path);

            const firstError = errorsArray[0];
            if (isErrorObj(firstError)) {
                const fieldName = firstError.path.join('.');
                extractedMessage = `${fieldName}: ${firstError.message || 'Invalid value'}`;
            }

            // Build a map of all errors for inline form display
            errorsArray.forEach((err) => {
                if (isErrorObj(err) && err.path.length > 0) {
                    validationErrors![err.path.join('.')] = err.message || 'Invalid value';
                }
            });
        }

        const apiError: ApiError & { body?: unknown } = {
            message: extractedMessage,
            statusCode: response.status,
            error: dataRecord.error as string | undefined,
            body: responseData ?? data,
            validationErrors,
        };

        // Record failure in safety net
        apiSafetyNet.recordFailure(endpoint, apiError);
        throw apiError;
    }

    async get<T>(endpoint: string, options?: RequestInit, schema?: z.ZodType<T>): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' }, schema);
    }

    async post<T>(endpoint: string, body?: unknown, options?: RequestInit, schema?: z.ZodType<T>): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: 'POST',
                body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
            },
            schema,
        );
    }

    async put<T>(endpoint: string, body?: unknown, options?: RequestInit, schema?: z.ZodType<T>): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: 'PUT',
                body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
            },
            schema,
        );
    }

    async patch<T>(endpoint: string, body?: unknown, options?: RequestInit, schema?: z.ZodType<T>): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: 'PATCH',
                body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
            },
            schema,
        );
    }

    async delete<T>(endpoint: string, options?: RequestInit, schema?: z.ZodType<T>): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' }, schema);
    }
}

export const apiClient = new ApiClient();
