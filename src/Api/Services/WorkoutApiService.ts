import { BaseApiService } from './BaseApiService';
import { Endpoints } from '../Endpoints';
import { IWorkout, IWorkoutCreate, IWorkoutUpdate } from '../../Models/Domain/Workout';
import { IPagedResponse } from '../../Types/Common';

export class WorkoutApiService extends BaseApiService {
    public async getWorkouts(request: URLSearchParams): Promise<IPagedResponse<IWorkout>> {
        return this.get<IPagedResponse<IWorkout>>(Endpoints.Workout.Base, request);
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