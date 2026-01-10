import { Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const stats = await dashboardService.getUserStats(userId);
      sendSuccess(res, stats, 'Estadísticas obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getCompanyStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.userId;
      const stats = await dashboardService.getCompanyStats(companyId);
      sendSuccess(res, stats, 'Estadísticas de empresa obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getRecentActivity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { limit } = req.query;
      const activity = await dashboardService.getRecentActivity(
        userId,
        limit ? parseInt(limit as string) : 10
      );
      sendSuccess(res, activity, 'Actividad reciente obtenida');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getRecommendations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const recommendations = await dashboardService.getRecommendations(userId);
      sendSuccess(res, recommendations, 'Recomendaciones obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
