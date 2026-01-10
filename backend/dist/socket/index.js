"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitToAll = exports.emitNotification = exports.emitNewMessage = exports.initializeSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Initialize Socket.IO with authentication and handlers
 */
const initializeSocket = (io) => {
    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error('Authentication required'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            next();
        }
        catch (error) {
            next(new Error('Invalid token'));
        }
    });
    // Connection handler
    io.on('connection', (socket) => {
        logger_1.default.info(`User connected: ${socket.userId}`);
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
        socket.on('conversation:join', (conversationId) => {
            socket.join(`conversation:${conversationId}`);
            logger_1.default.info(`User ${socket.userId} joined conversation ${conversationId}`);
        });
        // Handle leaving conversation rooms
        socket.on('conversation:leave', (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
            logger_1.default.info(`User ${socket.userId} left conversation ${conversationId}`);
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
            logger_1.default.info(`User disconnected: ${socket.userId}`);
            // Broadcast offline status
            socket.broadcast.emit('user:status', {
                userId: socket.userId,
                status: 'offline',
                lastSeen: new Date(),
            });
        });
        // Error handling
        socket.on('error', (error) => {
            logger_1.default.error('Socket error:', error);
        });
    });
    logger_1.default.info('✅ Socket.IO initialized');
};
exports.initializeSocket = initializeSocket;
/**
 * Emit new message to conversation participants
 */
const emitNewMessage = (io, conversationId, message) => {
    io.to(`conversation:${conversationId}`).emit('message:new', message);
};
exports.emitNewMessage = emitNewMessage;
/**
 * Emit notification to specific user
 */
const emitNotification = (io, userId, notification) => {
    io.to(`user:${userId}`).emit('notification:new', notification);
};
exports.emitNotification = emitNotification;
/**
 * Emit to all connected users
 */
const emitToAll = (io, event, data) => {
    io.emit(event, data);
};
exports.emitToAll = emitToAll;
//# sourceMappingURL=index.js.map