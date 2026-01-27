import type {
    IWorkoutTemplate,
    IWorkoutTemplateCreate,
    IWorkoutTemplateUpdate,
} from '../../models/domain/workout-template';
import type { IPagedRequest, IPagedResponse } from '../../types/common';
import { Endpoints } from '../endpoints';
import { BaseApiService } from './base-api-service';

export class WorkoutTemplateApiService extends BaseApiService {
    public async getWorkoutTemplates(
        request: IPagedRequest,
    ): Promise<IPagedResponse<IWorkoutTemplate>> {
        const params = new URLSearchParams(
            Object.entries(request).flatMap(([key, value]) =>
                Array.isArray(value)
                    ? value.map((v) => [key, v])
                    : [[key, value ?? '']],
            ),
        );
        return this.get<IPagedResponse<IWorkoutTemplate>>(
            Endpoints.WorkoutTemplate.Base,
            params,
        );
    }

    public async getWorkoutTemplate(id: string): Promise<IWorkoutTemplate> {
        return this.get<IWorkoutTemplate>(Endpoints.WorkoutTemplate.ById(id));
    }

    public async createWorkoutTemplate(
        template: IWorkoutTemplateCreate,
    ): Promise<IWorkoutTemplate> {
        return this.post<IWorkoutTemplate, IWorkoutTemplateCreate>(
            Endpoints.WorkoutTemplate.Base,
            template,
        );
    }

    public async updateWorkoutTemplate(
        id: string,
        template: IWorkoutTemplateUpdate,
    ): Promise<void> {
        return this.put<void, IWorkoutTemplateUpdate>(
            Endpoints.WorkoutTemplate.ById(id),
            template,
        );
    }

    public async deleteWorkoutTemplate(id: string): Promise<void> {
        return this.delete<void>(Endpoints.WorkoutTemplate.ById(id));
    }
}
