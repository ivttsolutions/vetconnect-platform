"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controller_1 = require("../controllers/messages.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const messagesController = new messages_controller_1.MessagesController();
// Todas las rutas requieren autenticación
router.use(auth_middleware_1.authMiddleware);
// Conversaciones
router.get('/', (req, res) => messagesController.getConversations(req, res));
router.post('/start', (req, res) => messagesController.startConversation(req, res));
router.get('/unread/count', (req, res) => messagesController.getUnreadCount(req, res));
// Mensajes de una conversación
router.get('/:conversationId', (req, res) => messagesController.getMessages(req, res));
router.post('/:conversationId', (req, res) => messagesController.sendMessage(req, res));
router.post('/:conversationId/read', (req, res) => messagesController.markAsRead(req, res));
exports.default = router;
//# sourceMappingURL=messages.routes.js.map