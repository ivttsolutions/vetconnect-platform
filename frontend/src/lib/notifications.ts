import api from './api';

export const notificationsApi = {
  // Obtener notificaciones
  getNotifications: async (limit = 20, offset = 0, unreadOnly = false) => {
    const response = await api.get(`/notifications?limit=${limit}&offset=${offset}&unreadOnly=${unreadOnly}`);
    return response.data;
  },

  // Contar no leídas
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },

  // Marcar como leída
  markAsRead: async (notificationId: string) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Marcar todas como leídas
  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },

  // Eliminar notificación
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
