"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionController = void 0;
const connections_service_1 = require("../services/connections.service");
const response_util_1 = require("../utils/response.util");
const connectionService = new connections_service_1.ConnectionService();
class ConnectionController {
    async sendRequest(req, res) {
        try {
            const userId = req.user.userId;
            const { receiverId, message } = req.body;
            const connection = await connectionService.sendRequest(userId, receiverId, message);
            (0, response_util_1.sendSuccess)(res, connection, 'Solicitud de conexión enviada', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async acceptRequest(req, res) {
        try {
            const userId = req.user.userId;
            const { connectionId } = req.params;
            const connection = await connectionService.acceptRequest(connectionId, userId);
            (0, response_util_1.sendSuccess)(res, connection, 'Conexión aceptada');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async rejectRequest(req, res) {
        try {
            const userId = req.user.userId;
            const { connectionId } = req.params;
            await connectionService.rejectRequest(connectionId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Solicitud rechazada');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async cancelRequest(req, res) {
        try {
            const userId = req.user.userId;
            const { connectionId } = req.params;
            await connectionService.cancelRequest(connectionId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Solicitud cancelada');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async removeConnection(req, res) {
        try {
            const userId = req.user.userId;
            const { connectionId } = req.params;
            await connectionService.removeConnection(connectionId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Conexión eliminada');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getPendingRequests(req, res) {
        try {
            const userId = req.user.userId;
            const requests = await connectionService.getPendingRequests(userId);
            (0, response_util_1.sendSuccess)(res, requests, 'Solicitudes pendientes obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getSentRequests(req, res) {
        try {
            const userId = req.user.userId;
            const requests = await connectionService.getSentRequests(userId);
            (0, response_util_1.sendSuccess)(res, requests, 'Solicitudes enviadas obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getConnections(req, res) {
        try {
            const userId = req.user.userId;
            const { limit, offset } = req.query;
            const connections = await connectionService.getConnections(userId, {
                limit: limit ? parseInt(limit) : 50,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, connections, 'Conexiones obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getConnectionsCount(req, res) {
        try {
            const userId = req.user.userId;
            const count = await connectionService.getConnectionsCount(userId);
            (0, response_util_1.sendSuccess)(res, { count }, 'Conteo obtenido');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getConnectionStatus(req, res) {
        try {
            const userId = req.user.userId;
            const { targetUserId } = req.params;
            const status = await connectionService.getConnectionStatus(userId, targetUserId);
            (0, response_util_1.sendSuccess)(res, status, 'Estado de conexión obtenido');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async searchUsers(req, res) {
        try {
            const userId = req.user.userId;
            const { q, limit, offset } = req.query;
            if (!q || typeof q !== 'string') {
                (0, response_util_1.sendError)(res, 'Se requiere un término de búsqueda', 400);
                return;
            }
            const users = await connectionService.searchUsers(userId, q, {
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, users, 'Usuarios encontrados');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getSuggestions(req, res) {
        try {
            const userId = req.user.userId;
            const { limit } = req.query;
            const suggestions = await connectionService.getSuggestions(userId, limit ? parseInt(limit) : 10);
            (0, response_util_1.sendSuccess)(res, suggestions, 'Sugerencias obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.ConnectionController = ConnectionController;
//# sourceMappingURL=connections.controller.js.map