import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import logger from './utils/logger';
import { initializeSocket } from './socket';
import Redis from 'ioredis';

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize Redis Client
export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  logger.error('❌ Redis connection error:', err);
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Initialize Socket.IO handlers
initializeSocket(io);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  
  httpServer.close(async () => {
    logger.info('HTTP server closed');
    
    await prisma.$disconnect();
    logger.info('Prisma disconnected');
    
    redis.disconnect();
    logger.info('Redis disconnected');
    
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  
  httpServer.close(async () => {
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
  });
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Uncaught Exception
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      logger.info(`
🚀 VetConnect API Server is running!
      
📍 Environment: ${NODE_ENV}
🌐 Server: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api-docs
🔌 Socket.IO: ws://localhost:${PORT}
      `);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };
