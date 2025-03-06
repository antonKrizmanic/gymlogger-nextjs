import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IWorkout, IWorkoutCreate, IWorkoutUpdate } from '../../Models/Domain/Workout';
import { IPagedRequest, IPagedResponse } from '../../Types/Common';

export interface IWorkoutRequest extends Omit<IPagedRequest, 'workoutDate'> {
    muscleGroupId: string;
    workoutDate?: Date;
}

export class WorkoutService extends BaseService {
    public async getWorkouts(request: IWorkoutRequest): Promise<IPagedResponse<IWorkout>> {
        return this.get<IPagedResponse<IWorkout>>(Endpoints.Workout.Base, {
            ...request,
            workoutDate: request.workoutDate?.toISOString()
        });
    }

    public async getWorkout(id: string): Promise<IWorkout> {
        return this.get<IWorkout>(Endpoints.Workout.ById(id));
    }

    public async getWorkoutForEdit(id: string): Promise<IWorkoutUpdate> {
        return this.get<IWorkoutUpdate>(Endpoints.Workout.GetForEdit(id));
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