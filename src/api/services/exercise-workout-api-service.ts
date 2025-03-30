import { BaseApiService } from './base-api-service';
import { Endpoints } from '../endpoints';
import { IExerciseWorkout } from '../../models/domain/workout';
import { IPagedResponse } from '../../types/common';

export class ExerciseApiWorkoutService extends BaseApiService {
    public async getLatestExerciseWorkout(exerciseId: string, workoutId: string | null): Promise<IExerciseWorkout> {
        return this.get<IExerciseWorkout>(
            Endpoints.ExerciseWorkout.GetLatest(exerciseId, workoutId)
        );
    }

    public async getPaginatedExerciseWorkouts(exerciseId: string, page: number, pageSize: number): Promise<IPagedResponse<IExerciseWorkout>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        
        return this.get<IPagedResponse<IExerciseWorkout>>(
            Endpoints.ExerciseWorkout.GetPaginated(exerciseId),
            params
        );
    }
}