import type { IWorkoutRequest } from '@/src/data/workout';
import type {
    IWorkout,
    IWorkoutCreate,
    IWorkoutMutationResponse,
    IWorkoutUpdate,
} from '../../models/domain/workout';
import type { IPagedResponse } from '../../types/common';
import { Endpoints } from '../endpoints';
import { BaseApiService } from './base-api-service';

export class WorkoutApiService extends BaseApiService {
    public async getWorkouts(
        request: IWorkoutRequest,
    ): Promise<IPagedResponse<IWorkout>> {
        const params = new URLSearchParams(
            Object.entries(request).flatMap(([key, value]) =>
                Array.isArray(value)
                    ? value.map((v) => [key, v])
                    : [[key, value ?? '']],
            ),
        );
        return this.get<IPagedResponse<IWorkout>>(
            Endpoints.Workout.Base,
            params,
        );
    }

    public async getWorkout(id: string): Promise<IWorkout> {
        return this.get<IWorkout>(Endpoints.Workout.ById(id));
    }

    public async createWorkout(
        workout: IWorkoutCreate,
    ): Promise<IWorkoutMutationResponse> {
        return this.post<IWorkoutMutationResponse, IWorkoutCreate>(
            Endpoints.Workout.Base,
            workout,
        );
    }

    public async updateWorkout(
        id: string,
        workout: IWorkoutUpdate,
    ): Promise<IWorkoutMutationResponse> {
        return this.put<IWorkoutMutationResponse, IWorkoutUpdate>(
            Endpoints.Workout.ById(id),
            workout,
        );
    }

    public async deleteWorkout(id: string): Promise<void> {
        return this.delete<void>(Endpoints.Workout.ById(id));
    }
}
