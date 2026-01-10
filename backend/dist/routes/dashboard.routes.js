"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authMiddleware);
// Estadísticas de usuario
router.get('/stats', (req, res) => dashboardController.getStats(req, res));
// Estadísticas de empresa
router.get('/company-stats', (req, res) => dashboardController.getCompanyStats(req, res));
// Actividad reciente
router.get('/activity', (req, res) => dashboardController.getRecentActivity(req, res));
// Recomendaciones
router.get('/recommendations', (req, res) => dashboardController.getRecommendations(req, res));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map