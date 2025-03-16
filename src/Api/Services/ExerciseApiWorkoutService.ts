import { BaseApiService } from './BaseApiService';
import { Endpoints } from '../Endpoints';
import { IExerciseWorkout } from '../../Models/Domain/Workout';

export class ExerciseApiWorkoutService extends BaseApiService {
    public async getLatestExerciseWorkout(exerciseId: string, workoutId: string | null): Promise<IExerciseWorkout> {
        return this.get<IExerciseWorkout>(
            Endpoints.ExerciseWorkout.GetLatest(exerciseId, workoutId)
        );
    }
} 