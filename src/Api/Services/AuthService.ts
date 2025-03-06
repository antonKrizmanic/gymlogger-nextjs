import { BaseService } from './BaseService';
import { Endpoints } from '../Endpoints';
import {
    IAccessTokenResponse,
    ILoginRequest,
    IRefreshTokenRequest,
    IRegisterRequest,
    IUserInfo
} from '../../Models/Domain/Auth';

export class AuthService extends BaseService {
    public async register(request: IRegisterRequest): Promise<void> {
        return this.post<void, IRegisterRequest>(Endpoints.Auth.Register, request);
    }

    public async login(request: ILoginRequest): Promise<void> {
        return this.post<void, ILoginRequest>(Endpoints.Auth.Login, request);
    }

    public async logout(): Promise<void> {
        return this.post<void>(Endpoints.Auth.Logout);
    }

    public async refresh(request: IRefreshTokenRequest): Promise<IAccessTokenResponse> {
        return this.post<IAccessTokenResponse, IRefreshTokenRequest>(Endpoints.Auth.Refresh, request);
    }

    public async getUserInfo(): Promise<IUserInfo> {
        return this.get<IUserInfo>(Endpoints.Auth.Info);
    }

    public async updateUserInfo(email?: string, newPassword?: string, oldPassword?: string): Promise<IUserInfo> {
        return this.post<IUserInfo>(Endpoints.Auth.Info, {
            newEmail: email,
            newPassword,
            oldPassword
        });
    }
} 