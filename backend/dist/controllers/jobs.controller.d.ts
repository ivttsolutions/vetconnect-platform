import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class JobsController {
    getJobs(req: AuthRequest, res: Response): Promise<void>;
    getJob(req: AuthRequest, res: Response): Promise<void>;
    createJob(req: AuthRequest, res: Response): Promise<void>;
    applyToJob(req: AuthRequest, res: Response): Promise<void>;
    saveJob(req: AuthRequest, res: Response): Promise<void>;
    getSavedJobs(req: AuthRequest, res: Response): Promise<void>;
    getMyApplications(req: AuthRequest, res: Response): Promise<void>;
    getCompanyJobs(req: AuthRequest, res: Response): Promise<void>;
    getJobApplications(req: AuthRequest, res: Response): Promise<void>;
    updateApplicationStatus(req: AuthRequest, res: Response): Promise<void>;
    closeJob(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=jobs.controller.d.ts.map