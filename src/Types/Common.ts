import { ExerciseLogType, SortDirection } from './Enums';

export interface IPagingDataResponseDto {
    totalItems: number;
    page: number;
    pageSize: number;
    search?: string;
    sortColumn?: string;
    sortDirection: SortDirection;
}

export interface IPagedResponse<T> {
    pagingData: IPagingDataResponseDto;
    items?: T[];
}

export type IPagedRequest = {
    [key: string]: string | number | ExerciseLogType | Date | boolean | null | undefined;
    page: number;
    pageSize: number;
    search?: string;
    sortColumn: string;
    sortDirection: SortDirection;
}

export interface IApiErrorResponse {
    message: string;
    code?: string | number;
    details?: unknown;
} 