"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const events_service_1 = require("../services/events.service");
const response_util_1 = require("../utils/response.util");
const eventsService = new events_service_1.EventsService();
class EventsController {
    async getEvents(req, res) {
        try {
            const { limit, offset, type, mode, city, upcoming } = req.query;
            const events = await eventsService.getEvents({
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
                type: type,
                mode: mode,
                city: city,
                upcoming: upcoming === 'true',
            });
            (0, response_util_1.sendSuccess)(res, events, 'Eventos obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getEvent(req, res) {
        try {
            const { eventId } = req.params;
            const userId = req.user?.userId;
            const event = await eventsService.getEvent(eventId, userId);
            (0, response_util_1.sendSuccess)(res, event, 'Evento obtenido');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async createEvent(req, res) {
        try {
            const organizerId = req.user.userId;
            const event = await eventsService.createEvent(organizerId, req.body);
            (0, response_util_1.sendSuccess)(res, event, 'Evento creado', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async registerToEvent(req, res) {
        try {
            const userId = req.user.userId;
            const { eventId } = req.params;
            const registration = await eventsService.registerToEvent(eventId, userId);
            (0, response_util_1.sendSuccess)(res, registration, 'Inscripción realizada', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async cancelRegistration(req, res) {
        try {
            const userId = req.user.userId;
            const { eventId } = req.params;
            await eventsService.cancelRegistration(eventId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Inscripción cancelada');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getMyRegistrations(req, res) {
        try {
            const userId = req.user.userId;
            const registrations = await eventsService.getMyRegistrations(userId);
            (0, response_util_1.sendSuccess)(res, registrations, 'Inscripciones obtenidas');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getMyOrganizedEvents(req, res) {
        try {
            const organizerId = req.user.userId;
            const events = await eventsService.getMyOrganizedEvents(organizerId);
            (0, response_util_1.sendSuccess)(res, events, 'Eventos organizados obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getEventAttendees(req, res) {
        try {
            const organizerId = req.user.userId;
            const { eventId } = req.params;
            const attendees = await eventsService.getEventAttendees(eventId, organizerId);
            (0, response_util_1.sendSuccess)(res, attendees, 'Asistentes obtenidos');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async updateRegistrationStatus(req, res) {
        try {
            const organizerId = req.user.userId;
            const { registrationId } = req.params;
            const { status } = req.body;
            const registration = await eventsService.updateRegistrationStatus(registrationId, organizerId, status);
            (0, response_util_1.sendSuccess)(res, registration, 'Estado actualizado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async cancelEvent(req, res) {
        try {
            const organizerId = req.user.userId;
            const { eventId } = req.params;
            const event = await eventsService.cancelEvent(eventId, organizerId);
            (0, response_util_1.sendSuccess)(res, event, 'Evento cancelado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.EventsController = EventsController;
//# sourceMappingURL=events.controller.js.map