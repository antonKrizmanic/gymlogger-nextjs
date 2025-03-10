import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IExerciseWorkout } from '../../Models/Domain/Workout';
import { IPagedRequest, IPagedResponse } from '../../Types/Common';

export interface IExerciseWorkoutRequest extends IPagedRequest {
    exerciseId: string | null;
    workoutId: string;
}

export class ExerciseWorkoutService extends BaseService {
    public async getExerciseWorkouts(request: IExerciseWorkoutRequest): Promise<IPagedResponse<IExerciseWorkout>> {
        return this.get<IPagedResponse<IExerciseWorkout>>(Endpoints.ExerciseWorkout.Base, request);
    }

    public async getLatestExerciseWorkout(exerciseId: string, workoutId: string | null): Promise<IExerciseWorkout> {
        return this.get<IExerciseWorkout>(
            Endpoints.ExerciseWorkout.GetLatest(exerciseId, workoutId)
        );
    }
} 