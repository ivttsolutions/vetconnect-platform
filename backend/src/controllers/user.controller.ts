import { Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { AuthRequest } from '../types';

const userService = new UserService();

export class UserController {
  async getMyProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthorized', 401);
      }

      const profile = await userService.getProfile(req.user.userId);
      return sendSuccess(res, profile, 'Profile retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to get profile', 400);
    }
  }

  async updateMyProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthorized', 401);
      }

      const updatedProfile = await userService.updateProfile(
        req.user.userId,
        req.body
      );
      return sendSuccess(res, updatedProfile, 'Profile updated successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update profile', 400);
    }
  }

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      return sendSuccess(res, user, 'User retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to get user', 404);
    }
  }

  async searchUsers(req: AuthRequest, res: Response) {
    try {
      const { q, limit } = req.query;
      
      if (!q) {
        return sendError(res, 'Query parameter is required', 400);
      }

      const users = await userService.searchUsers(
        q as string,
        limit ? parseInt(limit as string) : 10
      );
      
      return sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to search users', 400);
    }
  }
}
