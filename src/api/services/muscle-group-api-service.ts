import { BaseApiService } from './base-api-service';
import { Endpoints } from '../endpoints';
import { IMuscleGroup } from '../../models/domain/muscle-group';

export class MuscleGroupApiService extends BaseApiService {
    public async getMuscleGroups(): Promise<IMuscleGroup[]> {
        return this.get<IMuscleGroup[]>(Endpoints.MuscleGroup.Base);
    }

    public async getMuscleGroup(id: string): Promise<IMuscleGroup> {
        return this.get<IMuscleGroup>(Endpoints.MuscleGroup.ById(id));
    }
} 