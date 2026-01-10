import api from './api';

export const messagesApi = {
  // Obtener conversaciones
  getConversations: async (limit = 20, offset = 0) => {
    const response = await api.get(`/messages?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Obtener mensajes de una conversación
  getMessages: async (conversationId: string, limit = 50, offset = 0) => {
    const response = await api.get(`/messages/${conversationId}?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Enviar mensaje
  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post(`/messages/${conversationId}`, { content });
    return response.data;
  },

  // Iniciar conversación
  startConversation: async (receiverId: string, content: string) => {
    const response = await api.post('/messages/start', { receiverId, content });
    return response.data;
  },

  // Contar no leídos
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread/count');
    return response.data;
  },

  // Marcar como leída
  markAsRead: async (conversationId: string) => {
    const response = await api.post(`/messages/${conversationId}/read`);
    return response.data;
  },
};
