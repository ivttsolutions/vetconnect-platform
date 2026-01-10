import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class AdminController {
    getStats(req: AuthRequest, res: Response): Promise<void>;
    getUsers(req: AuthRequest, res: Response): Promise<void>;
    updateUserStatus(req: AuthRequest, res: Response): Promise<void>;
    deleteUser(req: AuthRequest, res: Response): Promise<void>;
    getPosts(req: AuthRequest, res: Response): Promise<void>;
    deletePost(req: AuthRequest, res: Response): Promise<void>;
    getJobs(req: AuthRequest, res: Response): Promise<void>;
    updateJobStatus(req: AuthRequest, res: Response): Promise<void>;
    getEvents(req: AuthRequest, res: Response): Promise<void>;
    updateEventStatus(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=admin.controller.d.ts.map