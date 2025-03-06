import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IMuscleGroup } from '../../Models/Domain/MuscleGroup';
import { IPagedRequest, IPagedResponse } from '../../Types/Common';

export class MuscleGroupService extends BaseService {
    public async getMuscleGroups(request: IPagedRequest): Promise<IPagedResponse<IMuscleGroup>> {
        return this.get<IPagedResponse<IMuscleGroup>>(Endpoints.MuscleGroup.Base, request);
    }

    public async getMuscleGroup(id: string): Promise<IMuscleGroup> {
        return this.get<IMuscleGroup>(Endpoints.MuscleGroup.ById(id));
    }
} 