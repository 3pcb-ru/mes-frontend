import { config } from './config';

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
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

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = this.getAuthToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch(url, {
            ...options,
            headers,
        });

        let data = await response.json();

        // Handle multiple levels of backend wrapping (data property)
        let responseData = data;
        while (responseData && typeof responseData === 'object' && 'data' in responseData && responseData !== responseData.data) {
            responseData = responseData.data;
        }

        // If 401, try to refresh token and retry
        if (response.status === 401) {
            const refreshed = await this.refreshAccessToken();
            
            if (refreshed) {
                // Retry the original request with new token
                const newToken = this.getAuthToken();
                const retryHeaders: HeadersInit = {
                    'Content-Type': 'application/json',
                    ...options.headers,
                };

                if (newToken) {
                    (retryHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
                }

                response = await fetch(url, {
                    ...options,
                    headers: retryHeaders,
                });

                data = await response.json();
                responseData = data;
                while (responseData && typeof responseData === 'object' && 'data' in responseData && responseData !== responseData.data) {
                    responseData = responseData.data;
                }
            }
        }

        if (!response.ok) {
            let extractedMessage = (data && data.message) || 'An error occurred';

            // Clean architecture: Centralize validation error parsing for all API requests
            // Check if it's a validation error with a nested errors array (typical Zod format)
            if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const firstError = data.errors[0];
                const fieldName = firstError.path?.join('.') || 'Field';
                extractedMessage = `${fieldName}: ${firstError.message}`;
            } else if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                // Check unwrapped body just in case
                const firstError = responseData.errors[0];
                const fieldName = firstError.path?.join('.') || 'Field';
                extractedMessage = `${fieldName}: ${firstError.message}`;
            }

            const error: ApiError & { body?: any } = {
                message: extractedMessage,
                statusCode: response.status,
                error: data && data.error,
                body: responseData ?? data,
            };
            throw error;
        }

        return responseData;
    }

    async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();
