import { ExerciseLogType, SortDirection } from './Enums';

export type QueryParams = {
    [key: string]: string | number | Date | ExerciseLogType | boolean | null | undefined;
};

export interface IPagingDataResponseDto {
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
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