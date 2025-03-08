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
        const response = await this.post<IAccessTokenResponse, ILoginRequest>(Endpoints.Auth.Login, request);
        if (typeof window !== "undefined") {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('tokenType', response.tokenType ?? '');
            localStorage.setItem('expiresIn', response.expiresIn.toString());        
        }
    }

    public async logout(): Promise<void> {
        return this.post<void>(Endpoints.Auth.Logout);
    }

    public async refresh(): Promise<string> {
        if (typeof window !== "undefined") {
            const request = {
                refreshToken: localStorage.getItem('refreshToken') ?? ''
            };
            const response = await this.post<IAccessTokenResponse, IRefreshTokenRequest>(Endpoints.Auth.Refresh, request);
            
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('tokenType', response.tokenType ?? '');
            localStorage.setItem('expiresIn', response.expiresIn.toString());
            return response.accessToken;
        }
        else {
            throw new Error('Refresh token not found');
        }
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