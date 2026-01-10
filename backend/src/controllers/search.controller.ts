import { Response } from 'express';
import { SearchService } from '../services/search.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const searchService = new SearchService();

export class SearchController {
  async searchAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { q, limit } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        sendError(res, 'La búsqueda debe tener al menos 2 caracteres', 400);
        return;
      }

      const results = await searchService.searchAll(q.trim(), {
        limit: limit ? parseInt(limit as string) : 10,
      });

      sendSuccess(res, results, 'Búsqueda completada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { q, limit, offset, userType } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        sendError(res, 'La búsqueda debe tener al menos 2 caracteres', 400);
        return;
      }

      const users = await searchService.searchUsers(q.trim(), {
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
        userType: userType as string,
      });

      sendSuccess(res, users, 'Usuarios encontrados');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
