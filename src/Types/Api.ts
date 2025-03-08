import { ExerciseLogType } from "./Enums";

export type QueryParams = {
    [key: string]: string | number | Date | ExerciseLogType | boolean | null | undefined;
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