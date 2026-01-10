"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profile_service_1 = require("../services/profile.service");
const upload_service_1 = require("../services/upload.service");
const response_util_1 = require("../utils/response.util");
const profileService = new profile_service_1.ProfileService();
const uploadService = new upload_service_1.UploadService();
class ProfileController {
    async getMyProfile(req, res) {
        try {
            const userId = req.user.userId;
            const profile = await profileService.getUserProfile(userId);
            (0, response_util_1.sendSuccess)(res, profile, 'Profile retrieved successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 404);
        }
    }
    async getPublicProfile(req, res) {
        try {
            const { userId } = req.params;
            const viewerId = req.user?.userId;
            const profile = await profileService.getPublicProfile(userId, viewerId);
            (0, response_util_1.sendSuccess)(res, profile, 'Profile retrieved successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 404);
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const profile = await profileService.updateUserProfile(userId, req.body);
            (0, response_util_1.sendSuccess)(res, profile, 'Profile updated successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async uploadAvatar(req, res) {
        try {
            const userId = req.user.userId;
            if (!req.file) {
                (0, response_util_1.sendError)(res, 'No file uploaded', 400);
                return;
            }
            const avatarUrl = await uploadService.uploadAvatar(req.file, userId);
            const profile = await profileService.updateAvatar(userId, avatarUrl);
            (0, response_util_1.sendSuccess)(res, { avatar: avatarUrl, profile }, 'Avatar uploaded successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async uploadCover(req, res) {
        try {
            const userId = req.user.userId;
            if (!req.file) {
                (0, response_util_1.sendError)(res, 'No file uploaded', 400);
                return;
            }
            const coverUrl = await uploadService.uploadCover(req.file, userId);
            const profile = await profileService.updateCover(userId, coverUrl);
            (0, response_util_1.sendSuccess)(res, { cover: coverUrl, profile }, 'Cover photo uploaded successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    // Experience
    async addExperience(req, res) {
        try {
            const userId = req.user.userId;
            const experience = await profileService.addExperience(userId, req.body);
            (0, response_util_1.sendSuccess)(res, experience, 'Experience added successfully', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async updateExperience(req, res) {
        try {
            const userId = req.user.userId;
            const { experienceId } = req.params;
            const experience = await profileService.updateExperience(experienceId, userId, req.body);
            (0, response_util_1.sendSuccess)(res, experience, 'Experience updated successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deleteExperience(req, res) {
        try {
            const userId = req.user.userId;
            const { experienceId } = req.params;
            await profileService.deleteExperience(experienceId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Experience deleted successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    // Education
    async addEducation(req, res) {
        try {
            const userId = req.user.userId;
            const education = await profileService.addEducation(userId, req.body);
            (0, response_util_1.sendSuccess)(res, education, 'Education added successfully', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async updateEducation(req, res) {
        try {
            const userId = req.user.userId;
            const { educationId } = req.params;
            const education = await profileService.updateEducation(educationId, userId, req.body);
            (0, response_util_1.sendSuccess)(res, education, 'Education updated successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deleteEducation(req, res) {
        try {
            const userId = req.user.userId;
            const { educationId } = req.params;
            await profileService.deleteEducation(educationId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Education deleted successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    // Skills
    async addSkill(req, res) {
        try {
            const userId = req.user.userId;
            const { name } = req.body;
            const skill = await profileService.addSkill(userId, name);
            (0, response_util_1.sendSuccess)(res, skill, 'Skill added successfully', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deleteSkill(req, res) {
        try {
            const userId = req.user.userId;
            const { skillId } = req.params;
            await profileService.deleteSkill(skillId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Skill deleted successfully');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    // Search
    async searchProfiles(req, res) {
        try {
            const { q, userType, country, limit, offset } = req.query;
            const profiles = await profileService.searchProfiles(q, {
                userType,
                country,
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, profiles, 'Profiles found');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map