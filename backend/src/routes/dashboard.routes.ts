import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Estadísticas de usuario
router.get('/stats', (req, res) => dashboardController.getStats(req, res));

// Estadísticas de empresa
router.get('/company-stats', (req, res) => dashboardController.getCompanyStats(req, res));

// Actividad reciente
router.get('/activity', (req, res) => dashboardController.getRecentActivity(req, res));

// Recomendaciones
router.get('/recommendations', (req, res) => dashboardController.getRecommendations(req, res));

export default router;
