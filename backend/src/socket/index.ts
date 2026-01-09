import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

/**
 * Initialize Socket.IO with authentication and handlers
 */
export const initializeSocket = (io: Server) => {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Handle user online status
    socket.on('user:online', () => {
      socket.broadcast.emit('user:status', {
        userId: socket.userId,
        status: 'online',
      });
    });

    // Handle typing indicator
    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:indicator', {
        userId: socket.userId,
        conversationId,
        typing: true,
      });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:indicator', {
        userId: socket.userId,
        conversationId,
        typing: false,
      });
    });

    // Handle joining conversation rooms
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Handle new messages (emit from backend after saving to DB)
    // This will be called from the messages controller
    // io.to(`conversation:${conversationId}`).emit('message:new', message);

    // Handle message read receipts
    socket.on('message:read', ({ messageId, conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('message:read', {
        messageId,
        userId: socket.userId,
        readAt: new Date(),
      });
    });

    // Handle notifications
    // This will be emitted from backend when notifications are created
    // io.to(`user:${userId}`).emit('notification:new', notification);

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
      
      // Broadcast offline status
      socket.broadcast.emit('user:status', {
        userId: socket.userId,
        status: 'offline',
        lastSeen: new Date(),
      });
    });

    // Error handling
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  logger.info('✅ Socket.IO initialized');
};

/**
 * Emit new message to conversation participants
 */
export const emitNewMessage = (io: Server, conversationId: string, message: any) => {
  io.to(`conversation:${conversationId}`).emit('message:new', message);
};

/**
 * Emit notification to specific user
 */
export const emitNotification = (io: Server, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};

/**
 * Emit to all connected users
 */
export const emitToAll = (io: Server, event: string, data: any) => {
  io.emit(event, data);
};
