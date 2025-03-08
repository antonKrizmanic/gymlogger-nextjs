import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class ApiClient {
    private static instance: AxiosInstance;

    private static createInstance(): AxiosInstance {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            //withCredentials: true, // Enable cookies            
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
            (error) => {
                // Handle 302 redirects or 401 unauthorized
                if (error.response?.status === 302 || error.response?.status === 401) {
                    const loginUrl = error.response.headers?.location;
                    if (loginUrl) {
                        // If we're not already on the login page, redirect to it
                        if (!window.location.pathname.includes('/login')) {
                            window.location.href = loginUrl;
                            return new Promise(() => {}); // Prevent further error handling
                        }
                    } else {
                        // Fallback to default login page if no location header
                        window.location.href = '/login';
                        return new Promise(() => {});
                    }
                }
                return Promise.reject(error);
            }
        );
    }
}

export const apiClient = ApiClient.getInstance(); 