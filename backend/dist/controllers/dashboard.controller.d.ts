import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class DashboardController {
    getStats(req: AuthRequest, res: Response): Promise<void>;
    getCompanyStats(req: AuthRequest, res: Response): Promise<void>;
    getRecentActivity(req: AuthRequest, res: Response): Promise<void>;
    getRecommendations(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map