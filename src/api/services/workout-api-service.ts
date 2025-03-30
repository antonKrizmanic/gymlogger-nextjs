import { BaseApiService } from './base-api-service';
import { Endpoints } from '../endpoints';
import { IWorkout, IWorkoutCreate, IWorkoutUpdate } from '../../models/domain/workout';
import { IPagedResponse } from '../../types/common';
import { IWorkoutRequest } from '@/src/data/workout';

export class WorkoutApiService extends BaseApiService {
    public async getWorkouts(request: IWorkoutRequest): Promise<IPagedResponse<IWorkout>> {
        const params = new URLSearchParams(
            Object.entries(request)
                .flatMap(([key, value]) =>
                    Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value ?? ""]]
                )
        );
        return this.get<IPagedResponse<IWorkout>>(Endpoints.Workout.Base, params);
    }

    public async getWorkout(id: string): Promise<IWorkout> {
        return this.get<IWorkout>(Endpoints.Workout.ById(id));
    }    

    public async createWorkout(workout: IWorkoutCreate): Promise<IWorkout> {
        return this.post<IWorkout, IWorkoutCreate>(Endpoints.Workout.Base, workout);
    }

    public async updateWorkout(id: string, workout: IWorkoutUpdate): Promise<void> {
        return this.put<void, IWorkoutUpdate>(Endpoints.Workout.ById(id), workout);
    }

    public async deleteWorkout(id: string): Promise<void> {
        return this.delete<void>(Endpoints.Workout.ById(id));
    }
} 