import { BaseApiService } from './BaseApiService';
import { Endpoints } from '../Endpoints';
import { IDashboard } from '../../Models/Domain/Dashboard';

export class DashboardApiService extends BaseApiService {
    public async getDashboard(): Promise<IDashboard> {
        return this.get<IDashboard>(Endpoints.Dashboard.Base);
    }
} 