"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notifications_service_1 = require("../services/notifications.service");
const response_util_1 = require("../utils/response.util");
const notificationService = new notifications_service_1.NotificationService();
class NotificationController {
    async getNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const { limit, offset, unreadOnly } = req.query;
            const notifications = await notificationService.getNotifications(userId, {
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
                unreadOnly: unreadOnly === 'true',
            });
            (0, response_util_1.sendSuccess)(res, notifications, 'Notificaciones obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.userId;
            const count = await notificationService.getUnreadCount(userId);
            (0, response_util_1.sendSuccess)(res, { count }, 'Conteo obtenido');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async markAsRead(req, res) {
        try {
            const userId = req.user.userId;
            const { notificationId } = req.params;
            const notification = await notificationService.markAsRead(notificationId, userId);
            (0, response_util_1.sendSuccess)(res, notification, 'Notificación marcada como leída');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async markAllAsRead(req, res) {
        try {
            const userId = req.user.userId;
            await notificationService.markAllAsRead(userId);
            (0, response_util_1.sendSuccess)(res, null, 'Todas las notificaciones marcadas como leídas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deleteNotification(req, res) {
        try {
            const userId = req.user.userId;
            const { notificationId } = req.params;
            await notificationService.delete(notificationId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Notificación eliminada');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notifications.controller.js.map