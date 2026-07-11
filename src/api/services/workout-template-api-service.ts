import type {
    IWorkoutTemplate,
    IWorkoutTemplateCreate,
    IWorkoutTemplateSimple,
    IWorkoutTemplateUpdate,
} from '../../models/domain/workout-template';
import type { IPagedRequest, IPagedResponse } from '../../types/common';
import { Endpoints } from '../endpoints';
import { BaseApiService } from './base-api-service';

export class WorkoutTemplateApiService extends BaseApiService {
    public async getWorkoutTemplates(
        request: IPagedRequest,
    ): Promise<IPagedResponse<IWorkoutTemplateSimple>> {
        const params = new URLSearchParams(
            Object.entries(request).flatMap(([key, value]) =>
                Array.isArray(value)
                    ? value.map((v) => [key, v])
                    : [[key, value ?? '']],
            ),
        );
        return this.get<IPagedResponse<IWorkoutTemplateSimple>>(
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
    ): Promise<IWorkoutTemplate> {
        return this.put<IWorkoutTemplate, IWorkoutTemplateUpdate>(
            Endpoints.WorkoutTemplate.ById(id),
            template,
        );
    }

    public async deleteWorkoutTemplate(id: string): Promise<void> {
        return this.delete<void>(Endpoints.WorkoutTemplate.ById(id));
    }
}
