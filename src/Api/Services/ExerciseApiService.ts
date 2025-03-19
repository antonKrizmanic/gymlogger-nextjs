import { BaseApiService } from './BaseApiService';
import { Endpoints } from '../Endpoints';
import { IExercise, IExerciseCreate, IExerciseUpdate } from '../../Models/Domain/Exercise';
import { IPagedResponse } from '../../Types/Common';

export class ExerciseApiService extends BaseApiService {
    public async getAllExercises(): Promise<IExercise[]> {
        return this.get<IExercise[]>(Endpoints.Exercise.GetAll);
    }

    public async getExercises(request: URLSearchParams): Promise<IPagedResponse<IExercise>> {
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