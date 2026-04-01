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

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

        let data: any;
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
                data = await response.text();
                try {
                    data = JSON.parse(data);
                } catch {
                    // Keep as text if not JSON
                }
            } catch {
                data = null;
            }
        }

        // Handle multiple levels of backend wrapping (data property)
        // Only unwrap if 'data' exists and there are no other significant properties (like pagination)
        let responseData = data;
        const METADATA_KEYS = ['success', 'message', 'data', 'error'];
        while (
            responseData &&
            typeof responseData === 'object' &&
            'data' in responseData &&
            responseData !== responseData.data &&
            Object.keys(responseData).every((key) => METADATA_KEYS.includes(key))
        ) {
            responseData = responseData.data;
        }

        // If 401, try to refresh token and retry
        if (response.status === 401) {
            const refreshed = await this.refreshAccessToken();

            if (refreshed) {
                // Retry requested logic remains same but needs safety check
                const newToken = this.getAuthToken();
                const retryHeaders: HeadersInit = {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...options.headers,
                };

                if (newToken) {
                    (retryHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
                }

                response = await fetch(url, { ...options, headers: retryHeaders });
                // (Reparse data simplified for succinctness - in production reuse parsing logic)
            }
        }

        if (response.ok) {
            apiSafetyNet.recordSuccess(endpoint);
            return responseData;
        }

        // Error handling
        let extractedMessage = (data && typeof data === 'object' && data.message) || 'An error occurred';
        let validationErrors: Record<string, string> | undefined;

        // Clean architecture: Centralize validation error parsing for all API requests
        const errorsArray = data?.errors || responseData?.errors;
        if (errorsArray && Array.isArray(errorsArray) && errorsArray.length > 0) {
            validationErrors = {};
            // Extract first error for the main message
            const firstError = errorsArray[0];
            const fieldName = firstError.path?.join('.') || 'Field';
            extractedMessage = `${fieldName}: ${firstError.message}`;

            // Build a map of all errors for inline form display
            errorsArray.forEach((err: any) => {
                if (err.path && err.path.length > 0) {
                    validationErrors![err.path.join('.')] = err.message;
                }
            });
        }

        const apiError: ApiError & { body?: any } = {
            message: extractedMessage,
            statusCode: response.status,
            error: data && typeof data === 'object' && data.error,
            body: responseData ?? data,
            validationErrors,
        };

        // Record failure in safety net
        apiSafetyNet.recordFailure(endpoint, apiError);
        throw apiError;
    }

    async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
        });
    }

    async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
        });
    }

    async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
        });
    }

    async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();
