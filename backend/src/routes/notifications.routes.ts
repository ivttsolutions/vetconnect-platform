import { Router } from 'express';
import { NotificationController } from '../controllers/notifications.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener notificaciones
router.get('/', (req, res) => notificationController.getNotifications(req, res));

// Contar no leídas
router.get('/unread/count', (req, res) => notificationController.getUnreadCount(req, res));

// Marcar todas como leídas
router.post('/read-all', (req, res) => notificationController.markAllAsRead(req, res));

// Marcar una como leída
router.post('/:notificationId/read', (req, res) => notificationController.markAsRead(req, res));

// Eliminar notificación
router.delete('/:notificationId', (req, res) => notificationController.deleteNotification(req, res));

export default router;
