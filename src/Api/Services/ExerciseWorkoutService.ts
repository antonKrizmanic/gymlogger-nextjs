import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IExerciseWorkout } from '../../Models/Domain/Workout';

export class ExerciseWorkoutService extends BaseService {
    public async getLatestExerciseWorkout(exerciseId: string, workoutId: string | null): Promise<IExerciseWorkout> {
        return this.get<IExerciseWorkout>(
            Endpoints.ExerciseWorkout.GetLatest(exerciseId, workoutId)
        );
    }
} 