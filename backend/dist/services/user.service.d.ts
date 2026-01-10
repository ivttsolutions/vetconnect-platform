import { UpdateProfileDto } from '../types';
export declare class UserService {
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<any>;
    getUserById(userId: string): Promise<any>;
    searchUsers(query: string, limit?: number): Promise<any>;
}
//# sourceMappingURL=user.service.d.ts.map