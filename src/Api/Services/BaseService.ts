import { AxiosInstance, AxiosResponse } from 'axios';
import { QueryParams } from '../../Types/Api';

export abstract class BaseService {
    private apiClientInstance: AxiosInstance | null = null;

    protected async getClient(): Promise<AxiosInstance> {
        if (!this.apiClientInstance) {
            const { apiClient } = await import('../Clients/ApiClient'); 
            this.apiClientInstance = apiClient;
        }
        return this.apiClientInstance;
    }

    protected async get<T>(url: string, params?: QueryParams): Promise<T> {
        const client = await this.getClient();
        const response: AxiosResponse<T> = await client.get(url, { params });
        return response.data;
    }

    protected async post<T, D = unknown>(url: string, data?: D): Promise<T> {
        const client = await this.getClient();
        const response: AxiosResponse<T> = await client.post(url, data);
        console.log(response.data);
        return response.data;
    }

    protected async put<T, D = unknown>(url: string, data?: D): Promise<T> {
        const client = await this.getClient();
        const response: AxiosResponse<T> = await client.put(url, data);
        return response.data;
    }

    protected async delete<T>(url: string): Promise<T> {
        const client = await this.getClient();
        const response: AxiosResponse<T> = await client.delete(url);
        return response.data;
    }

    protected async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
        const client = await this.getClient();
        const response: AxiosResponse<T> = await client.patch(url, data);
        return response.data;
    }
} 