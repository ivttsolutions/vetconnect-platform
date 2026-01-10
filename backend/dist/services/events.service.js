"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class EventsService {
    // Crear evento
    async createEvent(organizerId, data) {
        return prisma_1.default.event.create({
            data: {
                organizerId,
                type: data.type,
                mode: data.mode,
                status: 'PUBLISHED',
                title: data.title,
                description: data.description,
                coverImage: data.coverImage,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                timezone: data.timezone || 'Europe/Madrid',
                location: data.location,
                address: data.address,
                city: data.city,
                country: data.country,
                onlineUrl: data.onlineUrl,
                isFree: data.isFree ?? true,
                price: data.price,
                currency: data.currency || 'EUR',
                maxAttendees: data.maxAttendees,
                registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : undefined,
                requiresApproval: data.requiresApproval || false,
                publishedAt: new Date(),
            },
            include: {
                organizer: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
        });
    }
    // Obtener eventos públicos
    async getEvents(options = {}) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        const where = {
            status: 'PUBLISHED',
        };
        if (options.type) {
            where.type = options.type;
        }
        if (options.mode) {
            where.mode = options.mode;
        }
        if (options.city) {
            where.city = { contains: options.city, mode: 'insensitive' };
        }
        if (options.upcoming) {
            where.startDate = { gte: new Date() };
        }
        return prisma_1.default.event.findMany({
            where,
            orderBy: [
                { isSponsored: 'desc' },
                { startDate: 'asc' },
            ],
            take: limit,
            skip: offset,
            include: {
                organizer: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
                _count: {
                    select: { registrations: true },
                },
            },
        });
    }
    // Obtener detalle de evento
    async getEvent(eventId, userId) {
        const event = await prisma_1.default.event.findUnique({
            where: { id: eventId },
            include: {
                organizer: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
                _count: {
                    select: { registrations: true },
                },
            },
        });
        if (!event) {
            throw new Error('Evento no encontrado');
        }
        // Incrementar vistas
        await prisma_1.default.event.update({
            where: { id: eventId },
            data: { viewsCount: { increment: 1 } },
        });
        // Verificar si el usuario está registrado
        let isRegistered = false;
        let registrationStatus = null;
        if (userId) {
            const registration = await prisma_1.default.eventRegistration.findUnique({
                where: {
                    eventId_userId: { eventId, userId },
                },
            });
            isRegistered = !!registration;
            registrationStatus = registration?.status || null;
        }
        return {
            ...event,
            isRegistered,
            registrationStatus,
        };
    }
    // Registrarse a un evento
    async registerToEvent(eventId, userId) {
        const event = await prisma_1.default.event.findUnique({
            where: { id: eventId },
            include: {
                _count: { select: { registrations: true } },
            },
        });
        if (!event) {
            throw new Error('Evento no encontrado');
        }
        if (event.status !== 'PUBLISHED') {
            throw new Error('Este evento no está disponible');
        }
        // Verificar fecha límite
        if (event.registrationDeadline && new Date() > event.registrationDeadline) {
            throw new Error('El plazo de inscripción ha finalizado');
        }
        // Verificar capacidad
        if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
            throw new Error('El evento está completo');
        }
        // Verificar registro existente
        const existing = await prisma_1.default.eventRegistration.findUnique({
            where: {
                eventId_userId: { eventId, userId },
            },
        });
        if (existing) {
            throw new Error('Ya estás registrado en este evento');
        }
        const status = event.requiresApproval ? 'registered' : 'approved';
        const registration = await prisma_1.default.eventRegistration.create({
            data: {
                eventId,
                userId,
                status,
            },
            include: {
                event: {
                    include: {
                        organizer: {
                            include: {
                                companyProfile: true,
                            },
                        },
                    },
                },
            },
        });
        // Actualizar contador
        await prisma_1.default.event.update({
            where: { id: eventId },
            data: { registrationsCount: { increment: 1 } },
        });
        return registration;
    }
    // Cancelar registro
    async cancelRegistration(eventId, userId) {
        const registration = await prisma_1.default.eventRegistration.findUnique({
            where: {
                eventId_userId: { eventId, userId },
            },
        });
        if (!registration) {
            throw new Error('No estás registrado en este evento');
        }
        await prisma_1.default.eventRegistration.update({
            where: { id: registration.id },
            data: { status: 'cancelled' },
        });
        // Actualizar contador
        await prisma_1.default.event.update({
            where: { id: eventId },
            data: { registrationsCount: { decrement: 1 } },
        });
        return { cancelled: true };
    }
    // Obtener mis eventos (como asistente)
    async getMyRegistrations(userId) {
        return prisma_1.default.eventRegistration.findMany({
            where: {
                userId,
                status: { not: 'cancelled' },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                event: {
                    include: {
                        organizer: {
                            include: {
                                userProfile: true,
                                companyProfile: true,
                            },
                        },
                    },
                },
            },
        });
    }
    // Obtener eventos organizados
    async getMyOrganizedEvents(organizerId) {
        return prisma_1.default.event.findMany({
            where: { organizerId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { registrations: true },
                },
            },
        });
    }
    // Obtener asistentes de un evento
    async getEventAttendees(eventId, organizerId) {
        const event = await prisma_1.default.event.findUnique({
            where: { id: eventId },
        });
        if (!event || event.organizerId !== organizerId) {
            throw new Error('No tienes acceso a este evento');
        }
        return prisma_1.default.eventRegistration.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
        });
    }
    // Actualizar estado de registro
    async updateRegistrationStatus(registrationId, organizerId, status) {
        const registration = await prisma_1.default.eventRegistration.findUnique({
            where: { id: registrationId },
            include: { event: true },
        });
        if (!registration || registration.event.organizerId !== organizerId) {
            throw new Error('No tienes acceso a esta inscripción');
        }
        return prisma_1.default.eventRegistration.update({
            where: { id: registrationId },
            data: { status },
        });
    }
    // Cancelar evento
    async cancelEvent(eventId, organizerId) {
        const event = await prisma_1.default.event.findUnique({
            where: { id: eventId },
        });
        if (!event || event.organizerId !== organizerId) {
            throw new Error('No tienes acceso a este evento');
        }
        return prisma_1.default.event.update({
            where: { id: eventId },
            data: { status: 'CANCELLED' },
        });
    }
}
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map