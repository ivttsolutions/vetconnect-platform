"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class NotificationService {
    // Crear notificación
    async create(data) {
        return prisma_1.default.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                actionUrl: data.actionUrl,
                actorId: data.actorId,
                postId: data.postId,
                commentId: data.commentId,
                jobId: data.jobId,
                eventId: data.eventId,
            },
        });
    }
    // Obtener notificaciones del usuario
    async getNotifications(userId, options = {}) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        const where = { userId };
        if (options.unreadOnly) {
            where.readAt = null;
        }
        const notifications = await prisma_1.default.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
        // Enriquecer con datos del actor
        const enrichedNotifications = await Promise.all(notifications.map(async (notification) => {
            let actor = null;
            if (notification.actorId) {
                actor = await prisma_1.default.user.findUnique({
                    where: { id: notification.actorId },
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                });
            }
            return {
                ...notification,
                actor,
            };
        }));
        return enrichedNotifications;
    }
    // Contar no leídas
    async getUnreadCount(userId) {
        return prisma_1.default.notification.count({
            where: {
                userId,
                readAt: null,
            },
        });
    }
    // Marcar como leída
    async markAsRead(notificationId, userId) {
        const notification = await prisma_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification || notification.userId !== userId) {
            throw new Error('Notificación no encontrada');
        }
        return prisma_1.default.notification.update({
            where: { id: notificationId },
            data: { readAt: new Date(), isRead: true },
        });
    }
    // Marcar todas como leídas
    async markAllAsRead(userId) {
        await prisma_1.default.notification.updateMany({
            where: {
                userId,
                readAt: null,
            },
            data: { readAt: new Date(), isRead: true },
        });
        return { success: true };
    }
    // Eliminar notificación
    async delete(notificationId, userId) {
        const notification = await prisma_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification || notification.userId !== userId) {
            throw new Error('Notificación no encontrada');
        }
        await prisma_1.default.notification.delete({
            where: { id: notificationId },
        });
        return { deleted: true };
    }
    // Helpers para crear notificaciones específicas
    async notifyConnectionRequest(senderId, receiverId) {
        const sender = await prisma_1.default.user.findUnique({
            where: { id: senderId },
            include: { userProfile: true, companyProfile: true },
        });
        const senderName = sender?.companyProfile?.companyName ||
            `${sender?.userProfile?.firstName} ${sender?.userProfile?.lastName}` ||
            'Un usuario';
        return this.create({
            userId: receiverId,
            type: 'CONNECTION_REQUEST',
            title: 'Nueva solicitud de conexión',
            message: `${senderName} quiere conectar contigo`,
            actionUrl: '/network',
            actorId: senderId,
        });
    }
    async notifyConnectionAccepted(accepterId, senderId) {
        const accepter = await prisma_1.default.user.findUnique({
            where: { id: accepterId },
            include: { userProfile: true, companyProfile: true },
        });
        const accepterName = accepter?.companyProfile?.companyName ||
            `${accepter?.userProfile?.firstName} ${accepter?.userProfile?.lastName}` ||
            'Un usuario';
        return this.create({
            userId: senderId,
            type: 'CONNECTION_ACCEPTED',
            title: 'Conexión aceptada',
            message: `${accepterName} aceptó tu solicitud de conexión`,
            actionUrl: `/profile/${accepterId}`,
            actorId: accepterId,
        });
    }
    async notifyPostLike(likerId, postAuthorId, postId) {
        if (likerId === postAuthorId)
            return null;
        const liker = await prisma_1.default.user.findUnique({
            where: { id: likerId },
            include: { userProfile: true, companyProfile: true },
        });
        const likerName = liker?.companyProfile?.companyName ||
            `${liker?.userProfile?.firstName} ${liker?.userProfile?.lastName}` ||
            'Un usuario';
        return this.create({
            userId: postAuthorId,
            type: 'POST_LIKE',
            title: 'Nuevo me gusta',
            message: `A ${likerName} le gustó tu publicación`,
            actionUrl: `/posts/${postId}`,
            actorId: likerId,
            postId: postId,
        });
    }
    async notifyPostComment(commenterId, postAuthorId, postId, commentId) {
        if (commenterId === postAuthorId)
            return null;
        const commenter = await prisma_1.default.user.findUnique({
            where: { id: commenterId },
            include: { userProfile: true, companyProfile: true },
        });
        const commenterName = commenter?.companyProfile?.companyName ||
            `${commenter?.userProfile?.firstName} ${commenter?.userProfile?.lastName}` ||
            'Un usuario';
        return this.create({
            userId: postAuthorId,
            type: 'POST_COMMENT',
            title: 'Nuevo comentario',
            message: `${commenterName} comentó en tu publicación`,
            actionUrl: `/posts/${postId}`,
            actorId: commenterId,
            postId: postId,
            commentId: commentId,
        });
    }
    async notifyNewMessage(senderId, receiverId, conversationId) {
        const sender = await prisma_1.default.user.findUnique({
            where: { id: senderId },
            include: { userProfile: true, companyProfile: true },
        });
        const senderName = sender?.companyProfile?.companyName ||
            `${sender?.userProfile?.firstName} ${sender?.userProfile?.lastName}` ||
            'Un usuario';
        return this.create({
            userId: receiverId,
            type: 'MESSAGE',
            title: 'Nuevo mensaje',
            message: `${senderName} te envió un mensaje`,
            actionUrl: `/messages/${conversationId}`,
            actorId: senderId,
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notifications.service.js.map