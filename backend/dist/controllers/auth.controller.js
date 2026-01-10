"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_util_1 = require("../utils/response.util");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            return (0, response_util_1.sendCreated)(res, result, 'User registered successfully');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Registration failed', 400);
        }
    }
    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            return (0, response_util_1.sendSuccess)(res, result, 'Login successful');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Login failed', 401);
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshAccessToken(refreshToken);
            return (0, response_util_1.sendSuccess)(res, result, 'Token refreshed successfully');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Token refresh failed', 401);
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            await authService.logout(refreshToken);
            return (0, response_util_1.sendSuccess)(res, null, 'Logout successful');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Logout failed', 400);
        }
    }
    async getMe(req, res) {
        try {
            // User info is already in req.user from auth middleware
            return (0, response_util_1.sendSuccess)(res, req.user, 'User info retrieved');
        }
        catch (error) {
            return (0, response_util_1.sendError)(res, error.message || 'Failed to get user info', 400);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map