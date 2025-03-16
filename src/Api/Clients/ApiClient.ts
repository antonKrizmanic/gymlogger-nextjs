import { AuthService } from '../Services/AuthService';

type RequestConfig = {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
};

export class ApiClient {
    private static instance: ApiClient;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private async fetchWithAuth(endpoint: string, config: RequestConfig = {}): Promise<Response> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...config.headers
        };

        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...config,
            headers,
            body: config.body ? JSON.stringify(config.body) : undefined
        });

        if (response.status === 401) {
            // Only redirect on client-side
            if (typeof window !== 'undefined') {
                window.location.href = "/auth/login";
            }
            // Return the 401 response and let the caller handle it
            return response;
        }

        return response;
    }

    async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'GET'
        });
        return response.json();
    }

    async post<T>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'POST',
            body: data
        });
        return response.json();
    }

    async put<T>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'PUT',
            body: data
        });
        return response.json();
    }

    async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'DELETE'
        });
        return response.json();
    }
}

export const apiClient = ApiClient.getInstance();