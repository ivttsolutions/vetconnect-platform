import { Router } from 'express';
import { MessagesController } from '../controllers/messages.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const messagesController = new MessagesController();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// IMPORTANTE: Rutas estáticas ANTES de rutas dinámicas
router.get('/', (req, res) => messagesController.getConversations(req, res));
router.post('/start', (req, res) => messagesController.startConversation(req, res));
router.post('/conversation', (req, res) => messagesController.getOrCreateConversation(req, res));
router.get('/unread/count', (req, res) => messagesController.getUnreadCount(req, res));

// Rutas dinámicas con :conversationId AL FINAL
router.get('/:conversationId', (req, res) => messagesController.getMessages(req, res));
router.post('/:conversationId', (req, res) => messagesController.sendMessage(req, res));
router.post('/:conversationId/read', (req, res) => messagesController.markAsRead(req, res));

export default router;
