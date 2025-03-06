import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import { IDashboard } from '../../Models/Domain/Dashboard';
import { IPagedResponse } from '../../Types/Common';

export class DashboardService extends BaseService {
    public async getDashboard(): Promise<IPagedResponse<IDashboard>> {
        return this.get<IPagedResponse<IDashboard>>(Endpoints.Dashboard.Base);
    }
} 