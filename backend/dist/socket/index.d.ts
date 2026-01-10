import { Server } from 'socket.io';
/**
 * Initialize Socket.IO with authentication and handlers
 */
export declare const initializeSocket: (io: Server) => void;
/**
 * Emit new message to conversation participants
 */
export declare const emitNewMessage: (io: Server, conversationId: string, message: any) => void;
/**
 * Emit notification to specific user
 */
export declare const emitNotification: (io: Server, userId: string, notification: any) => void;
/**
 * Emit to all connected users
 */
export declare const emitToAll: (io: Server, event: string, data: any) => void;
//# sourceMappingURL=index.d.ts.map