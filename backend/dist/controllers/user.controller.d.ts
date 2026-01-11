import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class UserController {
    getMyProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateMyProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getUserById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    searchUsers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=user.controller.d.ts.map