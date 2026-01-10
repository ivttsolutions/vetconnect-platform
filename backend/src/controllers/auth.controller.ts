import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError, sendCreated } from '../utils/response.util';
import { AuthRequest } from '../types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return sendCreated(res, result, 'User registered successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Registration failed', 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      return sendError(res, error.message || 'Login failed', 401);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);
      return sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Token refresh failed', 401);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      return sendSuccess(res, null, 'Logout successful');
    } catch (error: any) {
      return sendError(res, error.message || 'Logout failed', 400);
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      // User info is already in req.user from auth middleware
      return sendSuccess(res, req.user, 'User info retrieved');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to get user info', 400);
    }
  }
}
