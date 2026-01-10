import prisma from '../config/prisma';

export class MessagesService {
  // Obtener o crear conversación entre dos usuarios
  async getOrCreateConversation(userId1: string, userId2: string) {
    // Buscar conversación existente
    const existing = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: userId1 } } },
          { participants: { some: { userId: userId2 } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              include: {
                userProfile: true,
                companyProfile: true,
              },
            },
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Crear nueva conversación
    return prisma.conversation.create({
      data: {
        isGroup: false,
        participants: {
          create: [
            { userId: userId1 },
            { userId: userId2 },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              include: {
                userProfile: true,
                companyProfile: true,
              },
            },
          },
        },
      },
    });
  }

  // Obtener conversaciones del usuario
  async getConversations(userId: string, options: { limit?: number; offset?: number } = {}) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
            leftAt: null,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        participants: {
          include: {
            user: {
              include: {
                userProfile: true,
                companyProfile: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Transformar para incluir el otro participante y último mensaje
    return conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p.userId !== userId);
      const myParticipant = conv.participants.find(p => p.userId === userId);
      const lastMessage = conv.messages[0] || null;
      
      // Contar mensajes no leídos
      const unreadCount = lastMessage && myParticipant?.lastReadAt 
        ? (new Date(lastMessage.createdAt) > new Date(myParticipant.lastReadAt) ? 1 : 0)
        : (lastMessage && !myParticipant?.lastReadAt ? 1 : 0);

      return {
        id: conv.id,
        isGroup: conv.isGroup,
        title: conv.title,
        otherUser: otherParticipant?.user || null,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
        } : null,
        unreadCount,
        lastMessageAt: conv.lastMessageAt,
      };
    });
  }

  // Obtener mensajes de una conversación
  async getMessages(conversationId: string, userId: string, options: { limit?: number; offset?: number } = {}) {
    const limit = options.limit || 50;
    const offset = options.offset || 0;

    // Verificar que el usuario es participante
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });

    if (!participant || participant.leftAt) {
      throw new Error('No tienes acceso a esta conversación');
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        sender: {
          include: {
            userProfile: true,
            companyProfile: true,
          },
        },
      },
    });

    // Marcar como leídos
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      data: { lastReadAt: new Date() },
    });

    return messages.reverse(); // Ordenar cronológicamente
  }

  // Enviar mensaje
  async sendMessage(conversationId: string, senderId: string, content: string, messageType: string = 'TEXT') {
    // Verificar que el usuario es participante
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId: senderId },
      },
    });

    if (!participant || participant.leftAt) {
      throw new Error('No tienes acceso a esta conversación');
    }

    // Crear mensaje
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        messageType: messageType as any,
      },
      include: {
        sender: {
          include: {
            userProfile: true,
            companyProfile: true,
          },
        },
      },
    });

    // Actualizar última actividad de la conversación
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Actualizar lastReadAt del remitente
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: { conversationId, userId: senderId },
      },
      data: { lastReadAt: new Date() },
    });

    return message;
  }

  // Iniciar conversación con mensaje
  async startConversation(senderId: string, receiverId: string, content: string) {
    if (senderId === receiverId) {
      throw new Error('No puedes enviarte mensajes a ti mismo');
    }

    const conversation = await this.getOrCreateConversation(senderId, receiverId);
    const message = await this.sendMessage(conversation.id, senderId, content);

    return {
      conversation,
      message,
    };
  }

  // Contar mensajes no leídos totales
  async getUnreadCount(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
            leftAt: null,
          },
        },
      },
      include: {
        participants: {
          where: { userId },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    let unreadCount = 0;
    for (const conv of conversations) {
      const myParticipant = conv.participants[0];
      const lastMessage = conv.messages[0];
      
      if (lastMessage && lastMessage.senderId !== userId) {
        if (!myParticipant?.lastReadAt || new Date(lastMessage.createdAt) > new Date(myParticipant.lastReadAt)) {
          unreadCount++;
        }
      }
    }

    return unreadCount;
  }

  // Marcar conversación como leída
  async markAsRead(conversationId: string, userId: string) {
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      data: { lastReadAt: new Date() },
    });

    return { success: true };
  }
}
