import api from './api';

export const adminApi = {
  // Estadísticas
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Usuarios
  getUsers: async (params?: { page?: number; limit?: number; search?: string; status?: string; userType?: string }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Posts
  getPosts: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/posts', { params });
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await api.delete(`/admin/posts/${postId}`);
    return response.data;
  },

  // Empleos
  getJobs: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/admin/jobs', { params });
    return response.data;
  },

  updateJobStatus: async (jobId: string, status: string) => {
    const response = await api.patch(`/admin/jobs/${jobId}/status`, { status });
    return response.data;
  },

  // Eventos
  getEvents: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/admin/events', { params });
    return response.data;
  },

  updateEventStatus: async (eventId: string, status: string) => {
    const response = await api.patch(`/admin/events/${eventId}/status`, { status });
    return response.data;
  },
};
