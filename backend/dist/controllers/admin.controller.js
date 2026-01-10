"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const response_util_1 = require("../utils/response.util");
const adminService = new admin_service_1.AdminService();
class AdminController {
    async getStats(req, res) {
        try {
            const stats = await adminService.getStats();
            (0, response_util_1.sendSuccess)(res, stats, 'Estadísticas obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getUsers(req, res) {
        try {
            const { page, limit, search, status, userType } = req.query;
            const result = await adminService.getUsers({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                search: search,
                status: status,
                userType: userType,
            });
            (0, response_util_1.sendSuccess)(res, result, 'Usuarios obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async updateUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const { status } = req.body;
            await adminService.updateUserStatus(userId, status);
            (0, response_util_1.sendSuccess)(res, null, 'Estado de usuario actualizado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            await adminService.deleteUser(userId);
            (0, response_util_1.sendSuccess)(res, null, 'Usuario eliminado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getPosts(req, res) {
        try {
            const { page, limit, search } = req.query;
            const result = await adminService.getPosts({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                search: search,
            });
            (0, response_util_1.sendSuccess)(res, result, 'Posts obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deletePost(req, res) {
        try {
            const { postId } = req.params;
            await adminService.deletePost(postId);
            (0, response_util_1.sendSuccess)(res, null, 'Post eliminado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getJobs(req, res) {
        try {
            const { page, limit, status } = req.query;
            const result = await adminService.getJobs({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                status: status,
            });
            (0, response_util_1.sendSuccess)(res, result, 'Empleos obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async updateJobStatus(req, res) {
        try {
            const { jobId } = req.params;
            const { status } = req.body;
            await adminService.updateJobStatus(jobId, status);
            (0, response_util_1.sendSuccess)(res, null, 'Estado de empleo actualizado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getEvents(req, res) {
        try {
            const { page, limit, status } = req.query;
            const result = await adminService.getEvents({
                page: page ? parseInt(page) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                status: status,
            });
            (0, response_util_1.sendSuccess)(res, result, 'Eventos obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async updateEventStatus(req, res) {
        try {
            const { eventId } = req.params;
            const { status } = req.body;
            await adminService.updateEventStatus(eventId, status);
            (0, response_util_1.sendSuccess)(res, null, 'Estado de evento actualizado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map