import { Response } from 'express';
import { EventsService } from '../services/events.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const eventsService = new EventsService();

export class EventsController {
  async getEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { limit, offset, type, mode, city, upcoming } = req.query;
      
      const events = await eventsService.getEvents({
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
        type: type as string,
        mode: mode as string,
        city: city as string,
        upcoming: upcoming === 'true',
      });
      
      sendSuccess(res, events, 'Eventos obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const userId = req.user?.userId;
      
      const event = await eventsService.getEvent(eventId, userId);
      sendSuccess(res, event, 'Evento obtenido');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async createEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizerId = req.user!.userId;
      const event = await eventsService.createEvent(organizerId, req.body);
      sendSuccess(res, event, 'Evento creado', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async registerToEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { eventId } = req.params;
      
      const registration = await eventsService.registerToEvent(eventId, userId);
      sendSuccess(res, registration, 'Inscripción realizada', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async cancelRegistration(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { eventId } = req.params;
      
      await eventsService.cancelRegistration(eventId, userId);
      sendSuccess(res, null, 'Inscripción cancelada');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getMyRegistrations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const registrations = await eventsService.getMyRegistrations(userId);
      sendSuccess(res, registrations, 'Inscripciones obtenidas');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getMyOrganizedEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizerId = req.user!.userId;
      const events = await eventsService.getMyOrganizedEvents(organizerId);
      sendSuccess(res, events, 'Eventos organizados obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getEventAttendees(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizerId = req.user!.userId;
      const { eventId } = req.params;
      
      const attendees = await eventsService.getEventAttendees(eventId, organizerId);
      sendSuccess(res, attendees, 'Asistentes obtenidos');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async updateRegistrationStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizerId = req.user!.userId;
      const { registrationId } = req.params;
      const { status } = req.body;
      
      const registration = await eventsService.updateRegistrationStatus(registrationId, organizerId, status);
      sendSuccess(res, registration, 'Estado actualizado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async cancelEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizerId = req.user!.userId;
      const { eventId } = req.params;
      
      const event = await eventsService.cancelEvent(eventId, organizerId);
      sendSuccess(res, event, 'Evento cancelado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
