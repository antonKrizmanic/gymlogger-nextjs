import type { IDashboard } from '../../models/domain/dashboard';
import { Endpoints } from '../endpoints';
import { BaseApiService } from './base-api-service';

export class DashboardApiService extends BaseApiService {
    public async getDashboard(): Promise<IDashboard> {
        return this.get<IDashboard>(Endpoints.Dashboard.Base);
    }
}
