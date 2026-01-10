import { Router } from 'express';
import { MessagesController } from '../controllers/messages.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const messagesController = new MessagesController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Conversaciones
router.get('/', (req, res) => messagesController.getConversations(req, res));
router.post('/start', (req, res) => messagesController.startConversation(req, res));
router.get('/unread/count', (req, res) => messagesController.getUnreadCount(req, res));

// Mensajes de una conversación
router.get('/:conversationId', (req, res) => messagesController.getMessages(req, res));
router.post('/:conversationId', (req, res) => messagesController.sendMessage(req, res));
router.post('/:conversationId/read', (req, res) => messagesController.markAsRead(req, res));

export default router;
