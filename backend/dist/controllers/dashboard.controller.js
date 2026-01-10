"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const response_util_1 = require("../utils/response.util");
const dashboardService = new dashboard_service_1.DashboardService();
class DashboardController {
    async getStats(req, res) {
        try {
            const userId = req.user.userId;
            const stats = await dashboardService.getUserStats(userId);
            (0, response_util_1.sendSuccess)(res, stats, 'Estadísticas obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getCompanyStats(req, res) {
        try {
            const companyId = req.user.userId;
            const stats = await dashboardService.getCompanyStats(companyId);
            (0, response_util_1.sendSuccess)(res, stats, 'Estadísticas de empresa obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getRecentActivity(req, res) {
        try {
            const userId = req.user.userId;
            const { limit } = req.query;
            const activity = await dashboardService.getRecentActivity(userId, limit ? parseInt(limit) : 10);
            (0, response_util_1.sendSuccess)(res, activity, 'Actividad reciente obtenida');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getRecommendations(req, res) {
        try {
            const userId = req.user.userId;
            const recommendations = await dashboardService.getRecommendations(userId);
            (0, response_util_1.sendSuccess)(res, recommendations, 'Recomendaciones obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map