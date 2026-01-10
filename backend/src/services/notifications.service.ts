import prisma from '../config/prisma';

export class NotificationService {
  // Crear notificación
  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    actorId?: string;
    postId?: string;
    commentId?: string;
    jobId?: string;
    eventId?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
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
  async getNotifications(userId: string, options: { limit?: number; offset?: number; unreadOnly?: boolean } = {}) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const where: any = { userId };
    if (options.unreadOnly) {
      where.readAt = null;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Enriquecer con datos del actor
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        let actor = null;
        if (notification.actorId) {
          actor = await prisma.user.findUnique({
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
      })
    );

    return enrichedNotifications;
  }

  // Contar no leídas
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });
  }

  // Marcar como leída
  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notificación no encontrada');
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date(), isRead: true },
    });
  }

  // Marcar todas como leídas
  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: { readAt: new Date(), isRead: true },
    });

    return { success: true };
  }

  // Eliminar notificación
  async delete(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notificación no encontrada');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { deleted: true };
  }

  // Helpers para crear notificaciones específicas
  async notifyConnectionRequest(senderId: string, receiverId: string) {
    const sender = await prisma.user.findUnique({
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

  async notifyConnectionAccepted(accepterId: string, senderId: string) {
    const accepter = await prisma.user.findUnique({
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

  async notifyPostLike(likerId: string, postAuthorId: string, postId: string) {
    if (likerId === postAuthorId) return null;

    const liker = await prisma.user.findUnique({
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

  async notifyPostComment(commenterId: string, postAuthorId: string, postId: string, commentId?: string) {
    if (commenterId === postAuthorId) return null;

    const commenter = await prisma.user.findUnique({
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

  async notifyNewMessage(senderId: string, receiverId: string, conversationId: string) {
    const sender = await prisma.user.findUnique({
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
