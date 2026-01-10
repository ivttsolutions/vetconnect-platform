import api from './api';

export const profileApi = {
  // Get my profile
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  // Get public profile
  getPublicProfile: async (userId: string) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: any) => {
    const response = await api.put('/profile/me', data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Upload cover
  uploadCover: async (file: File) => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await api.post('/profile/me/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Experience
  addExperience: async (data: any) => {
    const response = await api.post('/profile/me/experience', data);
    return response.data;
  },

  updateExperience: async (experienceId: string, data: any) => {
    const response = await api.put(`/profile/me/experience/${experienceId}`, data);
    return response.data;
  },

  deleteExperience: async (experienceId: string) => {
    const response = await api.delete(`/profile/me/experience/${experienceId}`);
    return response.data;
  },

  // Education
  addEducation: async (data: any) => {
    const response = await api.post('/profile/me/education', data);
    return response.data;
  },

  updateEducation: async (educationId: string, data: any) => {
    const response = await api.put(`/profile/me/education/${educationId}`, data);
    return response.data;
  },

  deleteEducation: async (educationId: string) => {
    const response = await api.delete(`/profile/me/education/${educationId}`);
    return response.data;
  },

  // Skills
  addSkill: async (name: string) => {
    const response = await api.post('/profile/me/skills', { name });
    return response.data;
  },

  deleteSkill: async (skillId: string) => {
    const response = await api.delete(`/profile/me/skills/${skillId}`);
    return response.data;
  },

  // Search
  searchProfiles: async (query: string, filters?: any) => {
    const params = new URLSearchParams({ q: query, ...filters });
    const response = await api.get(`/profile/search?${params}`);
    return response.data;
  },
};
