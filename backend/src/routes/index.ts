import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import profileRoutes from './profile.routes';
import postsRoutes from './posts.routes';
import connectionsRoutes from './connections.routes';
import notificationsRoutes from './notifications.routes';
import messagesRoutes from './messages.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'VetConnect API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profile', profileRoutes);
router.use('/posts', postsRoutes);
router.use('/connections', connectionsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/messages', messagesRoutes);

export default router;
