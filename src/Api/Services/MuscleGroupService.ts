import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IMuscleGroup } from '../../Models/Domain/MuscleGroup';

export class MuscleGroupService extends BaseService {
    public async getMuscleGroups(): Promise<IMuscleGroup[]> {
        return this.get<IMuscleGroup[]>(Endpoints.MuscleGroup.Base);
    }

    public async getMuscleGroup(id: string): Promise<IMuscleGroup> {
        return this.get<IMuscleGroup>(Endpoints.MuscleGroup.ById(id));
    }
} 