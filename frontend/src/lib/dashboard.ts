import api from './api';

export const dashboardApi = {
  // Estadísticas de usuario
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Estadísticas de empresa
  getCompanyStats: async () => {
    const response = await api.get('/dashboard/company-stats');
    return response.data;
  },

  // Actividad reciente
  getRecentActivity: async (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/dashboard/activity${params}`);
    return response.data;
  },

  // Recomendaciones
  getRecommendations: async () => {
    const response = await api.get('/dashboard/recommendations');
    return response.data;
  },
};
