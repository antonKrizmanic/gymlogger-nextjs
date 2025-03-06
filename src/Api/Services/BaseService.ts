import { AxiosInstance, AxiosResponse } from 'axios';
import { apiClient } from '../Clients/ApiClient';
import { QueryParams } from '../../Types/Api';

export abstract class BaseService {
    protected readonly client: AxiosInstance;
    private ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
    private DEFAULT_PAGE_SIZE = 12;

    constructor() {
        this.client = apiClient;
    }

    protected async get<T>(url: string, params?: QueryParams): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, { params });
        return response.data;
    }

    protected async post<T, D = unknown>(url: string, data?: D): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data);
        console.log(response.data);
        return response.data;
    }

    protected async put<T, D = unknown>(url: string, data?: D): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data);
        return response.data;
    }

    protected async delete<T>(url: string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url);
        return response.data;
    }

    protected async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data);
        return response.data;
    }
} 