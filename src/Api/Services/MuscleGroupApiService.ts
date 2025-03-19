import { BaseApiService } from './BaseApiService';
import { Endpoints } from '../Endpoints';
import { IMuscleGroup } from '../../Models/Domain/MuscleGroup';

export class MuscleGroupApiService extends BaseApiService {
    public async getMuscleGroups(): Promise<IMuscleGroup[]> {
        return this.get<IMuscleGroup[]>(Endpoints.MuscleGroup.Base);
    }

    public async getMuscleGroup(id: string): Promise<IMuscleGroup> {
        return this.get<IMuscleGroup>(Endpoints.MuscleGroup.ById(id));
    }
} 