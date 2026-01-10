import api from './api';

export const jobsApi = {
  // Obtener empleos
  getJobs: async (options: {
    limit?: number;
    offset?: number;
    jobType?: string;
    location?: string;
    remote?: boolean;
    search?: string;
  } = {}) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.jobType) params.append('jobType', options.jobType);
    if (options.location) params.append('location', options.location);
    if (options.remote !== undefined) params.append('remote', options.remote.toString());
    if (options.search) params.append('search', options.search);
    
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Obtener detalle de empleo
  getJob: async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Crear empleo
  createJob: async (data: any) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  // Aplicar a empleo
  applyToJob: async (jobId: string, data: { coverLetter?: string; resumeUrl?: string }) => {
    const response = await api.post(`/jobs/${jobId}/apply`, data);
    return response.data;
  },

  // Guardar/desguardar empleo
  saveJob: async (jobId: string) => {
    const response = await api.post(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Obtener empleos guardados
  getSavedJobs: async () => {
    const response = await api.get('/jobs/my/saved');
    return response.data;
  },

  // Obtener mis aplicaciones
  getMyApplications: async () => {
    const response = await api.get('/jobs/my/applications');
    return response.data;
  },

  // Obtener empleos publicados (empresa)
  getMyPostedJobs: async () => {
    const response = await api.get('/jobs/my/posted');
    return response.data;
  },

  // Obtener aplicaciones de un empleo (empresa)
  getJobApplications: async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response.data;
  },

  // Actualizar estado de aplicación (empresa)
  updateApplicationStatus: async (applicationId: string, status: string) => {
    const response = await api.patch(`/jobs/applications/${applicationId}/status`, { status });
    return response.data;
  },

  // Cerrar empleo
  closeJob: async (jobId: string) => {
    const response = await api.post(`/jobs/${jobId}/close`);
    return response.data;
  },
};
