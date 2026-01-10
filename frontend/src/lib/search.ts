import api from './api';

export const searchApi = {
  // Búsqueda global
  searchAll: async (query: string, limit?: number) => {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', limit.toString());
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  },

  // Búsqueda de usuarios
  searchUsers: async (query: string, options?: { limit?: number; offset?: number; userType?: string }) => {
    const params = new URLSearchParams({ q: query });
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.userType) params.append('userType', options.userType);
    const response = await api.get(`/search/users?${params.toString()}`);
    return response.data;
  },
};
