import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IExercise, IExerciseCreate, IExerciseUpdate } from '../../Models/Domain/Exercise';
import { IPagedRequest, IPagedResponse } from '../../Types/Common';
import { ExerciseLogType } from '../../Types/Enums';

export interface IExerciseRequest extends IPagedRequest {
    muscleGroupId?: string;
    exerciseLogType?: ExerciseLogType;
    search?: string;
}

export class ExerciseService extends BaseService {
    public async getExercises(request: IExerciseRequest): Promise<IPagedResponse<IExercise>> {
        return this.get<IPagedResponse<IExercise>>(Endpoints.Exercise.Base, request);
    }

    public async getExercise(id: string): Promise<IExercise> {
        return this.get<IExercise>(Endpoints.Exercise.ById(id));
    }

    public async createExercise(exercise: IExerciseCreate): Promise<IExercise> {
        return this.post<IExercise, IExerciseCreate>(Endpoints.Exercise.Base, exercise);
    }

    public async updateExercise(id: string, exercise: IExerciseUpdate): Promise<void> {
        return this.put<void, IExerciseUpdate>(Endpoints.Exercise.ById(id), exercise);
    }

    public async deleteExercise(id: string): Promise<void> {
        return this.delete<void>(Endpoints.Exercise.ById(id));
    }
} 