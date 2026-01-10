import { Request } from 'express';
import { JwtPayload } from '../utils/jwt.util';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: 'USER' | 'COMPANY' | 'SHELTER';
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    bio?: string;
    phone?: string;
    country?: string;
    city?: string;
    specialization?: string[];
    yearsOfExperience?: number;
}
//# sourceMappingURL=index.d.ts.map