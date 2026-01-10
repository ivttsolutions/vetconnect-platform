"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const response_util_1 = require("../utils/response.util");
const userService = new user_service_1.UserService();
class UserController {
    async getMyProfile(req, res) {
        try {
            if (!req.user) {
                return (0, response_util_1.sendError)(res, 'Unauthorized', 401);
            }
            const profile = await userService.getProfile(req.user.userId);
            return (0, response_util_1.sendSuccess)(res, profile, 'Profile retrieved successfully');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Failed to get profile', 400);
        }
    }
    async updateMyProfile(req, res) {
        try {
            if (!req.user) {
                return (0, response_util_1.sendError)(res, 'Unauthorized', 401);
            }
            const updatedProfile = await userService.updateProfile(req.user.userId, req.body);
            return (0, response_util_1.sendSuccess)(res, updatedProfile, 'Profile updated successfully');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Failed to update profile', 400);
        }
    }
    async getUserById(req, res) {
        try {
            const { userId } = req.params;
            const user = await userService.getUserById(userId);
            return (0, response_util_1.sendSuccess)(res, user, 'User retrieved successfully');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Failed to get user', 404);
        }
    }
    async searchUsers(req, res) {
        try {
            const { q, limit } = req.query;
            if (!q) {
                return (0, response_util_1.sendError)(res, 'Query parameter is required', 400);
            }
            const users = await userService.searchUsers(q, limit ? parseInt(limit) : 10);
            return (0, response_util_1.sendSuccess)(res, users, 'Users retrieved successfully');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Failed to search users', 400);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map