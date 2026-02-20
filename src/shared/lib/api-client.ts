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

    constructor() {
        this.baseUrl = config.apiBaseUrl;
    }

    private getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
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

        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        // Handle backend wrapping (data property)
        const responseData = data && typeof data === 'object' && 'data' in data ? data.data : data;

        if (!response.ok) {
            const error: ApiError = {
                message: (data && data.message) || 'An error occurred',
                statusCode: response.status,
                error: data && data.error,
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
