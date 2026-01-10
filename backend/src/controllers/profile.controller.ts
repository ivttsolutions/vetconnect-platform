import { Response } from 'express';
import { ProfileService } from '../services/profile.service';
import { UploadService } from '../services/upload.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const profileService = new ProfileService();
const uploadService = new UploadService();

export class ProfileController {
  async getMyProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.getUserProfile(userId);
      sendSuccess(res, profile, 'Profile retrieved successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async getPublicProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const viewerId = req.user?.userId;
      const profile = await profileService.getPublicProfile(userId, viewerId);
      sendSuccess(res, profile, 'Profile retrieved successfully');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.updateUserProfile(userId, req.body);
      sendSuccess(res, profile, 'Profile updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async uploadAvatar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      if (!req.file) {
        sendError(res, 'No file uploaded', 400);
        return;
      }

      const avatarUrl = await uploadService.uploadAvatar(req.file, userId);
      const profile = await profileService.updateAvatar(userId, avatarUrl);
      sendSuccess(res, { avatar: avatarUrl, profile }, 'Avatar uploaded successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async uploadCover(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      if (!req.file) {
        sendError(res, 'No file uploaded', 400);
        return;
      }

      const coverUrl = await uploadService.uploadCover(req.file, userId);
      const profile = await profileService.updateCover(userId, coverUrl);
      sendSuccess(res, { cover: coverUrl, profile }, 'Cover photo uploaded successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  // Experience
  async addExperience(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const experience = await profileService.addExperience(userId, req.body);
      sendSuccess(res, experience, 'Experience added successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateExperience(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { experienceId } = req.params;
      const experience = await profileService.updateExperience(experienceId, userId, req.body);
      sendSuccess(res, experience, 'Experience updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteExperience(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { experienceId } = req.params;
      await profileService.deleteExperience(experienceId, userId);
      sendSuccess(res, null, 'Experience deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  // Education
  async addEducation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const education = await profileService.addEducation(userId, req.body);
      sendSuccess(res, education, 'Education added successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateEducation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { educationId } = req.params;
      const education = await profileService.updateEducation(educationId, userId, req.body);
      sendSuccess(res, education, 'Education updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteEducation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { educationId } = req.params;
      await profileService.deleteEducation(educationId, userId);
      sendSuccess(res, null, 'Education deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  // Skills
  async addSkill(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name } = req.body;
      const skill = await profileService.addSkill(userId, name);
      sendSuccess(res, skill, 'Skill added successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteSkill(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { skillId } = req.params;
      await profileService.deleteSkill(skillId, userId);
      sendSuccess(res, null, 'Skill deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  // Search
  async searchProfiles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { q, userType, country, limit, offset } = req.query;
      const profiles = await profileService.searchProfiles(q as string, {
        userType,
        country,
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      sendSuccess(res, profiles, 'Profiles found');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
