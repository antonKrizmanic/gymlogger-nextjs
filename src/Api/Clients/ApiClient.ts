import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthService } from '../Services/AuthService';

export class ApiClient {
    private static instance: AxiosInstance;

    private static createInstance(): AxiosInstance {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',                
            },            
        });

        instance.interceptors.request.use((config) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
            return config;
        });

        return instance;
    }

    public static getInstance(): AxiosInstance {
        if (!ApiClient.instance) {
            ApiClient.instance = ApiClient.createInstance();
            ApiClient.setupInterceptors();
        }
        return ApiClient.instance;
    }

    private static setupInterceptors(): void {
        ApiClient.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const authService = new AuthService();
                    const newAccessToken = await authService.refresh();
                    
                    if (newAccessToken) {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return ApiClient.instance(originalRequest); 
                    } else {
                        window.location.href = "/login"; 
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
}

export const apiClient = ApiClient.getInstance(); 