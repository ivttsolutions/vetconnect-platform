import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class UserController {
    getMyProfile(req: AuthRequest, res: Response): Promise<Response>;
    updateMyProfile(req: AuthRequest, res: Response): Promise<Response>;
    getUserById(req: AuthRequest, res: Response): Promise<Response>;
    searchUsers(req: AuthRequest, res: Response): Promise<Response>;
}
//# sourceMappingURL=user.controller.d.ts.map