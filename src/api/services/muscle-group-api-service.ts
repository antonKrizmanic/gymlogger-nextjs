import type { IMuscleGroup } from '../../models/domain/muscle-group';
import { Endpoints } from '../endpoints';
import { BaseApiService } from './base-api-service';

export class MuscleGroupApiService extends BaseApiService {
    public async getMuscleGroups(): Promise<IMuscleGroup[]> {
        return this.get<IMuscleGroup[]>(Endpoints.MuscleGroup.Base);
    }

    public async getMuscleGroup(id: string): Promise<IMuscleGroup> {
        return this.get<IMuscleGroup>(Endpoints.MuscleGroup.ById(id));
    }
}
