import api from './api';

export const eventsApi = {
  // Obtener eventos
  getEvents: async (options: {
    limit?: number;
    offset?: number;
    type?: string;
    mode?: string;
    city?: string;
    upcoming?: boolean;
  } = {}) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.type) params.append('type', options.type);
    if (options.mode) params.append('mode', options.mode);
    if (options.city) params.append('city', options.city);
    if (options.upcoming) params.append('upcoming', 'true');
    
    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },

  // Obtener detalle de evento
  getEvent: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Crear evento
  createEvent: async (data: any) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  // Registrarse a evento
  registerToEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Cancelar registro
  cancelRegistration: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/cancel-registration`);
    return response.data;
  },

  // Obtener mis inscripciones
  getMyRegistrations: async () => {
    const response = await api.get('/events/my/registrations');
    return response.data;
  },

  // Obtener eventos organizados
  getMyOrganizedEvents: async () => {
    const response = await api.get('/events/my/organized');
    return response.data;
  },

  // Obtener asistentes
  getEventAttendees: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/attendees`);
    return response.data;
  },

  // Cancelar evento
  cancelEvent: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/cancel`);
    return response.data;
  },
};
