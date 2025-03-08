import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IDashboard } from '../../Models/Domain/Dashboard';

export class DashboardService extends BaseService {
    public async getDashboard(): Promise<IDashboard> {
        return this.get<IDashboard>(Endpoints.Dashboard.Base);
    }
} 