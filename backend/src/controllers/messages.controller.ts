import { Response } from 'express';
import { MessagesService } from '../services/messages.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const messagesService = new MessagesService();

export class MessagesController {
  async getConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { limit, offset } = req.query;
      
      const conversations = await messagesService.getConversations(userId, {
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      
      sendSuccess(res, conversations, 'Conversaciones obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { conversationId } = req.params;
      const { limit, offset } = req.query;
      
      const messages = await messagesService.getMessages(conversationId, userId, {
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      
      sendSuccess(res, messages, 'Mensajes obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { conversationId } = req.params;
      const { content, messageType } = req.body;
      
      if (!content?.trim()) {
        sendError(res, 'El mensaje no puede estar vacío', 400);
        return;
      }
      
      const message = await messagesService.sendMessage(conversationId, userId, content, messageType);
      sendSuccess(res, message, 'Mensaje enviado', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async startConversation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { receiverId, content } = req.body;
      
      if (!receiverId) {
        sendError(res, 'Se requiere el ID del destinatario', 400);
        return;
      }
      
      if (!content?.trim()) {
        sendError(res, 'El mensaje no puede estar vacío', 400);
        return;
      }
      
      const result = await messagesService.startConversation(userId, receiverId, content);
      sendSuccess(res, result, 'Conversación iniciada', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const count = await messagesService.getUnreadCount(userId);
      sendSuccess(res, { count }, 'Conteo obtenido');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { conversationId } = req.params;
      
      await messagesService.markAsRead(conversationId, userId);
      sendSuccess(res, null, 'Conversación marcada como leída');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getOrCreateConversation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { userId: otherUserId } = req.body;
      
      console.log('[getOrCreateConversation] Request body:', req.body);
      console.log('[getOrCreateConversation] userId:', userId, 'otherUserId:', otherUserId);
      
      if (!otherUserId) {
        sendError(res, 'Se requiere el ID del usuario', 400);
        return;
      }
      
      const conversation = await messagesService.getOrCreateConversation(userId, otherUserId);
      sendSuccess(res, conversation, 'Conversación obtenida');
    } catch (error: any) {
      console.error('[getOrCreateConversation] Error:', error);
      sendError(res, error.message || 'Error al obtener conversación', 400);
    }
  }
}
