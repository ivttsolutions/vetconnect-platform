import { Request, Response } from 'express';
import { AuthRequest } from '../types';
export declare class AuthController {
    register(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    refreshToken(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    getMe(req: AuthRequest, res: Response): Promise<Response>;
}
//# sourceMappingURL=auth.controller.d.ts.map