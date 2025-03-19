import { ApiClient } from '../Clients/ApiClient';

export abstract class BaseApiService {
    private apiClientInstance: ApiClient | null = null;

    protected async getClient(): Promise<ApiClient> {
        if (!this.apiClientInstance) {
            const { apiClient } = await import('../Clients/ApiClient');
            this.apiClientInstance = apiClient;
        }
        return this.apiClientInstance;
    }

    protected async get<T>(url: string, params?: URLSearchParams): Promise<T> {
        const client = await this.getClient();
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return client.get<T>(`${url}${queryString}`);
    }

    protected async post<T, D = unknown>(url: string, data?: D): Promise<T> {
        const client = await this.getClient();
        return client.post<T>(url, data);
    }

    protected async put<T, D = unknown>(url: string, data?: D): Promise<T> {
        const client = await this.getClient();
        return client.put<T>(url, data);
    }

    protected async delete<T>(url: string): Promise<T> {
        const client = await this.getClient();
        return client.delete<T>(url);
    }

    protected async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
        const client = await this.getClient();
        return client.post<T>(url, data, { method: 'PATCH' });
    }
}