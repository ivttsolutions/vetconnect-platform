"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const messages_service_1 = require("../services/messages.service");
const response_util_1 = require("../utils/response.util");
const messagesService = new messages_service_1.MessagesService();
class MessagesController {
    async getConversations(req, res) {
        try {
            const userId = req.user.userId;
            const { limit, offset } = req.query;
            const conversations = await messagesService.getConversations(userId, {
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, conversations, 'Conversaciones obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getMessages(req, res) {
        try {
            const userId = req.user.userId;
            const { conversationId } = req.params;
            const { limit, offset } = req.query;
            const messages = await messagesService.getMessages(conversationId, userId, {
                limit: limit ? parseInt(limit) : 50,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, messages, 'Mensajes obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async sendMessage(req, res) {
        try {
            const userId = req.user.userId;
            const { conversationId } = req.params;
            const { content, messageType } = req.body;
            if (!content?.trim()) {
                (0, response_util_1.sendError)(res, 'El mensaje no puede estar vacío', 400);
                return;
            }
            const message = await messagesService.sendMessage(conversationId, userId, content, messageType);
            (0, response_util_1.sendSuccess)(res, message, 'Mensaje enviado', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async startConversation(req, res) {
        try {
            const userId = req.user.userId;
            const { receiverId, content } = req.body;
            if (!receiverId) {
                (0, response_util_1.sendError)(res, 'Se requiere el ID del destinatario', 400);
                return;
            }
            if (!content?.trim()) {
                (0, response_util_1.sendError)(res, 'El mensaje no puede estar vacío', 400);
                return;
            }
            const result = await messagesService.startConversation(userId, receiverId, content);
            (0, response_util_1.sendSuccess)(res, result, 'Conversación iniciada', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.userId;
            const count = await messagesService.getUnreadCount(userId);
            (0, response_util_1.sendSuccess)(res, { count }, 'Conteo obtenido');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async markAsRead(req, res) {
        try {
            const userId = req.user.userId;
            const { conversationId } = req.params;
            await messagesService.markAsRead(conversationId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Conversación marcada como leída');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getOrCreateConversation(req, res) {
        try {
            const userId = req.user.userId;
            const { userId: otherUserId } = req.body;
            console.log('[getOrCreateConversation] Request body:', req.body);
            console.log('[getOrCreateConversation] userId:', userId, 'otherUserId:', otherUserId);
            if (!otherUserId) {
                (0, response_util_1.sendError)(res, 'Se requiere el ID del usuario', 400);
                return;
            }
            const conversation = await messagesService.getOrCreateConversation(userId, otherUserId);
            (0, response_util_1.sendSuccess)(res, conversation, 'Conversación obtenida');
        }
        catch (error) {
            console.error('[getOrCreateConversation] Error:', error);
            (0, response_util_1.sendError)(res, error.message || 'Error al obtener conversación', 400);
        }
    }
}
exports.MessagesController = MessagesController;
//# sourceMappingURL=messages.controller.js.map