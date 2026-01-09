import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Root
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to VetConnect API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      profiles: '/api/v1/profiles',
      posts: '/api/v1/posts',
      connections: '/api/v1/connections',
      jobs: '/api/v1/jobs',
      products: '/api/v1/products',
      events: '/api/v1/events',
      messages: '/api/v1/messages',
      notifications: '/api/v1/notifications',
      groups: '/api/v1/groups',
      shelters: '/api/v1/shelters',
      search: '/api/v1/search',
      admin: '/api/v1/admin',
    },
  });
});

// Import route modules (to be implemented)
// import authRoutes from './auth.routes';
// import userRoutes from './users.routes';
// import profileRoutes from './profiles.routes';
// import postRoutes from './posts.routes';
// import connectionRoutes from './connections.routes';
// import jobRoutes from './jobs.routes';
// import productRoutes from './products.routes';
// import eventRoutes from './events.routes';
// import messageRoutes from './messages.routes';
// import notificationRoutes from './notifications.routes';
// import groupRoutes from './groups.routes';
// import shelterRoutes from './shelters.routes';
// import searchRoutes from './search.routes';
// import adminRoutes from './admin.routes';

// Mount routes (uncomment as you implement them)
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/profiles', profileRoutes);
// router.use('/posts', postRoutes);
// router.use('/connections', connectionRoutes);
// router.use('/jobs', jobRoutes);
// router.use('/products', productRoutes);
// router.use('/events', eventRoutes);
// router.use('/messages', messageRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/groups', groupRoutes);
// router.use('/shelters', shelterRoutes);
// router.use('/search', searchRoutes);
// router.use('/admin', adminRoutes);

export default router;
