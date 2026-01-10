import { Response } from 'express';
import { NotificationService } from '../services/notifications.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { limit, offset, unreadOnly } = req.query;
      
      const notifications = await notificationService.getNotifications(userId, {
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
        unreadOnly: unreadOnly === 'true',
      });
      
      sendSuccess(res, notifications, 'Notificaciones obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const count = await notificationService.getUnreadCount(userId);
      sendSuccess(res, { count }, 'Conteo obtenido');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { notificationId } = req.params;
      
      const notification = await notificationService.markAsRead(notificationId, userId);
      sendSuccess(res, notification, 'Notificación marcada como leída');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      await notificationService.markAllAsRead(userId);
      sendSuccess(res, null, 'Todas las notificaciones marcadas como leídas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { notificationId } = req.params;
      
      await notificationService.delete(notificationId, userId);
      sendSuccess(res, null, 'Notificación eliminada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
