type RequestConfig = {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
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

    private async parseResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const body = await response.json().catch(() => null);
            const message =
                body && typeof body.error === 'string'
                    ? body.error
                    : `Request failed with status ${response.status}`;
            throw new Error(message);
        }

        if (response.status === 204) return undefined as T;
        return response.json() as Promise<T>;
    }

    async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'GET',
        });
        return this.parseResponse<T>(response);
    }

    async post<T>(
        endpoint: string,
        data: unknown,
        config: RequestConfig = {},
    ): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'POST',
            body: data,
        });
        return this.parseResponse<T>(response);
    }

    async put<T>(
        endpoint: string,
        data: unknown,
        config: RequestConfig = {},
    ): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'PUT',
            body: data,
        });
        return this.parseResponse<T>(response);
    }

    async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const response = await this.fetchWithAuth(endpoint, {
            ...config,
            method: 'DELETE',
        });
        return this.parseResponse<T>(response);
    }
}

export const apiClient = ApiClient.getInstance();
