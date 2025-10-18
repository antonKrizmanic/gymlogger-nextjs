import type { IExerciseRequest } from '@/src/data/exercise';
import type {
    IExercise,
    IExerciseCreate,
    IExerciseUpdate,
} from '../../models/domain/exercise';
import type { IPagedResponse } from '../../types/common';
import { Endpoints } from '../endpoints';
import { BaseApiService } from './base-api-service';

export class ExerciseApiService extends BaseApiService {
    public async getAllExercises(): Promise<IExercise[]> {
        return this.get<IExercise[]>(Endpoints.Exercise.GetAll);
    }

    public async getExercises(
        request: IExerciseRequest,
    ): Promise<IPagedResponse<IExercise>> {
        const params = new URLSearchParams(
            Object.entries(request).flatMap(([key, value]) =>
                Array.isArray(value)
                    ? value.map((v) => [key, v])
                    : [[key, value ?? '']],
            ),
        );
        return this.get<IPagedResponse<IExercise>>(
            Endpoints.Exercise.Base,
            params,
        );
    }

    public async getExercise(id: string): Promise<IExercise> {
        return this.get<IExercise>(Endpoints.Exercise.ById(id));
    }

    public async createExercise(exercise: IExerciseCreate): Promise<IExercise> {
        return this.post<IExercise, IExerciseCreate>(
            Endpoints.Exercise.Base,
            exercise,
        );
    }

    public async updateExercise(
        id: string,
        exercise: IExerciseUpdate,
    ): Promise<void> {
        return this.put<void, IExerciseUpdate>(
            Endpoints.Exercise.ById(id),
            exercise,
        );
    }

    public async deleteExercise(id: string): Promise<void> {
        return this.delete<void>(Endpoints.Exercise.ById(id));
    }
}
