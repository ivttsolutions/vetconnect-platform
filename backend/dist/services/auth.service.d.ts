import { RegisterDto, LoginDto } from '../types';
export declare class AuthService {
    register(data: RegisterDto): Promise<{
        user: {
            id: any;
            email: any;
            userType: any;
            role: any;
            status: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            userType: any;
            role: any;
            status: any;
            profile: any;
            companyProfile: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map