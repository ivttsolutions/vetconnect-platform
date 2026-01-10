import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class NotificationController {
    getNotifications(req: AuthRequest, res: Response): Promise<void>;
    getUnreadCount(req: AuthRequest, res: Response): Promise<void>;
    markAsRead(req: AuthRequest, res: Response): Promise<void>;
    markAllAsRead(req: AuthRequest, res: Response): Promise<void>;
    deleteNotification(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=notifications.controller.d.ts.map