type RequestConfig = {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
};

export class ApiClient {
    private static instance: ApiClient;

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private async fetchWithAuth(
        endpoint: string,
        config: RequestConfig = {},
    ): Promise<Response> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...config.headers,
        };

        const response = await fetch(`${endpoint}`, {
            credentials: 'include',
            ...config,
            headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
        });

        return response;
    }

    async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'GET',
        });
        return response.json();
    }

    async post<T>(
        endpoint: string,
        data: any,
        config: RequestConfig = {},
    ): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'POST',
            body: data,
        });
        return response.json();
    }

    async put<T>(
        endpoint: string,
        data: any,
        config: RequestConfig = {},
    ): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'PUT',
            body: data,
        });
        return response.json();
    }

    async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'DELETE',
        });
        return response.json();
    }
}

export const apiClient = ApiClient.getInstance();
