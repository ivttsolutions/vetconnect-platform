import api from './api';

export const connectionsApi = {
  // Enviar solicitud de conexión
  sendRequest: async (receiverId: string, message?: string) => {
    const response = await api.post('/connections/request', { receiverId, message });
    return response.data;
  },

  // Aceptar solicitud
  acceptRequest: async (connectionId: string) => {
    const response = await api.post(`/connections/${connectionId}/accept`);
    return response.data;
  },

  // Rechazar solicitud
  rejectRequest: async (connectionId: string) => {
    const response = await api.post(`/connections/${connectionId}/reject`);
    return response.data;
  },

  // Cancelar solicitud enviada
  cancelRequest: async (connectionId: string) => {
    const response = await api.delete(`/connections/${connectionId}/cancel`);
    return response.data;
  },

  // Eliminar conexión
  removeConnection: async (connectionId: string) => {
    const response = await api.delete(`/connections/${connectionId}`);
    return response.data;
  },

  // Obtener solicitudes pendientes
  getPendingRequests: async () => {
    const response = await api.get('/connections/pending');
    return response.data;
  },

  // Obtener solicitudes enviadas
  getSentRequests: async () => {
    const response = await api.get('/connections/sent');
    return response.data;
  },

  // Obtener mis conexiones
  getConnections: async (limit = 50, offset = 0) => {
    const response = await api.get(`/connections?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Contar conexiones
  getConnectionsCount: async () => {
    const response = await api.get('/connections/count');
    return response.data;
  },

  // Verificar estado de conexión con otro usuario
  getConnectionStatus: async (targetUserId: string) => {
    const response = await api.get(`/connections/status/${targetUserId}`);
    return response.data;
  },

  // Buscar usuarios
  searchUsers: async (query: string, limit = 20, offset = 0) => {
    const response = await api.get(`/connections/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Obtener sugerencias
  getSuggestions: async (limit = 10) => {
    const response = await api.get(`/connections/suggestions?limit=${limit}`);
    return response.data;
  },
};
