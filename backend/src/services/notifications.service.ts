import prisma from '../config/prisma';

export class NotificationService {
  // Crear notificación
  async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    actorId?: string;
    entityId?: string;
    entityType?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        link: data.link,
        actorId: data.actorId,
        entityId: data.entityId,
        entityType: data.entityType,
      },
      include: {
        actor: {
          include: {
            userProfile: true,
            companyProfile: true,
          },
        },
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
      include: {
        actor: {
          include: {
            userProfile: true,
            companyProfile: true,
          },
        },
      },
    });

    return notifications;
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
      data: { readAt: new Date() },
    });
  }

  // Marcar todas como leídas
  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: { readAt: new Date() },
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
      link: '/network',
      actorId: senderId,
      entityType: 'connection',
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
      link: `/profile/${accepterId}`,
      actorId: accepterId,
      entityType: 'connection',
    });
  }

  async notifyPostLike(likerId: string, postAuthorId: string, postId: string) {
    if (likerId === postAuthorId) return null; // No notificar al mismo usuario

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
      link: `/posts/${postId}`,
      actorId: likerId,
      entityId: postId,
      entityType: 'post',
    });
  }

  async notifyPostComment(commenterId: string, postAuthorId: string, postId: string) {
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
      link: `/posts/${postId}`,
      actorId: commenterId,
      entityId: postId,
      entityType: 'post',
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
      type: 'NEW_MESSAGE',
      title: 'Nuevo mensaje',
      message: `${senderName} te envió un mensaje`,
      link: `/messages/${conversationId}`,
      actorId: senderId,
      entityId: conversationId,
      entityType: 'conversation',
    });
  }
}
