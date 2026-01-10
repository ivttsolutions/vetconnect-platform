import { Response } from 'express';
import { ConnectionService } from '../services/connections.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const connectionService = new ConnectionService();

export class ConnectionController {
  async sendRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { receiverId, message } = req.body;
      const connection = await connectionService.sendRequest(userId, receiverId, message);
      sendSuccess(res, connection, 'Solicitud de conexión enviada', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async acceptRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { connectionId } = req.params;
      const connection = await connectionService.acceptRequest(connectionId, userId);
      sendSuccess(res, connection, 'Conexión aceptada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async rejectRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { connectionId } = req.params;
      await connectionService.rejectRequest(connectionId, userId);
      sendSuccess(res, null, 'Solicitud rechazada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async cancelRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { connectionId } = req.params;
      await connectionService.cancelRequest(connectionId, userId);
      sendSuccess(res, null, 'Solicitud cancelada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async removeConnection(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { connectionId } = req.params;
      await connectionService.removeConnection(connectionId, userId);
      sendSuccess(res, null, 'Conexión eliminada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getPendingRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const requests = await connectionService.getPendingRequests(userId);
      sendSuccess(res, requests, 'Solicitudes pendientes obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getSentRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const requests = await connectionService.getSentRequests(userId);
      sendSuccess(res, requests, 'Solicitudes enviadas obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getConnections(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { limit, offset } = req.query;
      const connections = await connectionService.getConnections(userId, {
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      sendSuccess(res, connections, 'Conexiones obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getConnectionsCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const count = await connectionService.getConnectionsCount(userId);
      sendSuccess(res, { count }, 'Conteo obtenido');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getConnectionStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { targetUserId } = req.params;
      const status = await connectionService.getConnectionStatus(userId, targetUserId);
      sendSuccess(res, status, 'Estado de conexión obtenido');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { q, limit, offset } = req.query;
      
      if (!q || typeof q !== 'string') {
        sendError(res, 'Se requiere un término de búsqueda', 400);
        return;
      }

      const users = await connectionService.searchUsers(userId, q, {
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      sendSuccess(res, users, 'Usuarios encontrados');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getSuggestions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { limit } = req.query;
      const suggestions = await connectionService.getSuggestions(
        userId,
        limit ? parseInt(limit as string) : 10
      );
      sendSuccess(res, suggestions, 'Sugerencias obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
