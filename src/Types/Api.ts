export type QueryParams = {
    [key: string]: string | number | boolean | null | undefined;
};

export interface IApiError {
    message: string;
    code?: string | number;
    details?: unknown;
}

export type ApiResponse<T> = {
    data: T;
    status: number;
    message?: string;
} 