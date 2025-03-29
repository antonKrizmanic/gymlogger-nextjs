import { BaseApiService } from './base-api-service';
import { Endpoints } from '../endpoints';
import { IDashboard } from '../../models/domain/dashboard';

export class DashboardApiService extends BaseApiService {
    public async getDashboard(): Promise<IDashboard> {
        return this.get<IDashboard>(Endpoints.Dashboard.Base);
    }
} 