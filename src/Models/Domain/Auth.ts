export interface IRegisterRequest {
    email: string;
    password: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
    twoFactorCode?: string;
    twoFactorRecoveryCode?: string;
}

export interface IAccessTokenResponse {
    tokenType?: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

export interface IRefreshTokenRequest {
    refreshToken: string;
}

export interface IUserInfo {
    email: string;
    isEmailConfirmed: boolean;
} 