import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const adminService = new AdminService();

export class AdminController {
  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await adminService.getStats();
      sendSuccess(res, stats, 'Estadísticas obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit, search, status, userType } = req.query;
      const result = await adminService.getUsers({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        status: status as string,
        userType: userType as string,
      });
      sendSuccess(res, result, 'Usuarios obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      await adminService.updateUserStatus(userId, status);
      sendSuccess(res, null, 'Estado de usuario actualizado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      await adminService.deleteUser(userId);
      sendSuccess(res, null, 'Usuario eliminado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getPosts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit, search } = req.query;
      const result = await adminService.getPosts({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
      });
      sendSuccess(res, result, 'Posts obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deletePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      await adminService.deletePost(postId);
      sendSuccess(res, null, 'Post eliminado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getJobs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit, status } = req.query;
      const result = await adminService.getJobs({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
      });
      sendSuccess(res, result, 'Empleos obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateJobStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const { status } = req.body;
      await adminService.updateJobStatus(jobId, status);
      sendSuccess(res, null, 'Estado de empleo actualizado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page, limit, status } = req.query;
      const result = await adminService.getEvents({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
      });
      sendSuccess(res, result, 'Eventos obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateEventStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const { status } = req.body;
      await adminService.updateEventStatus(eventId, status);
      sendSuccess(res, null, 'Estado de evento actualizado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
