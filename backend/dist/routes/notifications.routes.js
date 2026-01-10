"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("../controllers/notifications.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const notificationController = new notifications_controller_1.NotificationController();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authMiddleware);
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
exports.default = router;
//# sourceMappingURL=notifications.routes.js.map