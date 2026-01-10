import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
const adminController = new AdminController();

// Todas las rutas requieren autenticación y rol de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Estadísticas
router.get('/stats', (req, res) => adminController.getStats(req, res));

// Usuarios
router.get('/users', (req, res) => adminController.getUsers(req, res));
router.patch('/users/:userId/status', (req, res) => adminController.updateUserStatus(req, res));
router.delete('/users/:userId', (req, res) => adminController.deleteUser(req, res));

// Posts
router.get('/posts', (req, res) => adminController.getPosts(req, res));
router.delete('/posts/:postId', (req, res) => adminController.deletePost(req, res));

// Empleos
router.get('/jobs', (req, res) => adminController.getJobs(req, res));
router.patch('/jobs/:jobId/status', (req, res) => adminController.updateJobStatus(req, res));

// Eventos
router.get('/events', (req, res) => adminController.getEvents(req, res));
router.patch('/events/:eventId/status', (req, res) => adminController.updateEventStatus(req, res));

export default router;
