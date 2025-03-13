import { SortDirection } from './Enums';

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