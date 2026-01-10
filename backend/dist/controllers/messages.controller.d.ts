import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class MessagesController {
    getConversations(req: AuthRequest, res: Response): Promise<void>;
    getMessages(req: AuthRequest, res: Response): Promise<void>;
    sendMessage(req: AuthRequest, res: Response): Promise<void>;
    startConversation(req: AuthRequest, res: Response): Promise<void>;
    getUnreadCount(req: AuthRequest, res: Response): Promise<void>;
    markAsRead(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=messages.controller.d.ts.map