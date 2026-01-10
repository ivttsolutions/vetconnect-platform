"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class DashboardService {
    // Estadísticas para usuario individual
    async getUserStats(userId) {
        const [connectionsCount, pendingRequestsCount, postsCount, totalLikes, totalComments, applicationsCount, savedJobsCount, eventsRegisteredCount, unreadNotificationsCount,] = await Promise.all([
            // Conexiones aceptadas
            prisma_1.default.connection.count({
                where: {
                    OR: [
                        { senderId: userId, status: 'ACCEPTED' },
                        { receiverId: userId, status: 'ACCEPTED' },
                    ],
                },
            }),
            // Solicitudes pendientes recibidas
            prisma_1.default.connection.count({
                where: { receiverId: userId, status: 'PENDING' },
            }),
            // Posts publicados
            prisma_1.default.post.count({
                where: { authorId: userId },
            }),
            // Total likes recibidos
            prisma_1.default.like.count({
                where: { post: { authorId: userId } },
            }),
            // Total comentarios recibidos
            prisma_1.default.comment.count({
                where: { post: { authorId: userId } },
            }),
            // Aplicaciones a empleos
            prisma_1.default.jobApplication.count({
                where: { applicantId: userId },
            }),
            // Empleos guardados
            prisma_1.default.savedJob.count({
                where: { userId },
            }),
            // Eventos registrados
            prisma_1.default.eventRegistration.count({
                where: { userId, status: { not: 'cancelled' } },
            }),
            // Notificaciones no leídas
            prisma_1.default.notification.count({
                where: { userId, isRead: false },
            }),
        ]);
        return {
            connections: connectionsCount,
            pendingRequests: pendingRequestsCount,
            posts: postsCount,
            totalLikes,
            totalComments,
            applications: applicationsCount,
            savedJobs: savedJobsCount,
            eventsRegistered: eventsRegisteredCount,
            unreadMessages: 0,
            unreadNotifications: unreadNotificationsCount,
        };
    }
    // Estadísticas para empresa
    async getCompanyStats(companyId) {
        const [jobsPosted, activeJobs, totalApplications, eventsOrganized, upcomingEvents, totalRegistrations, connectionsCount,] = await Promise.all([
            prisma_1.default.jobPost.count({ where: { companyId } }),
            prisma_1.default.jobPost.count({ where: { companyId, status: 'ACTIVE' } }),
            prisma_1.default.jobApplication.count({ where: { job: { companyId } } }),
            prisma_1.default.event.count({ where: { organizerId: companyId } }),
            prisma_1.default.event.count({ where: { organizerId: companyId, startDate: { gte: new Date() }, status: 'PUBLISHED' } }),
            prisma_1.default.eventRegistration.count({ where: { event: { organizerId: companyId } } }),
            prisma_1.default.connection.count({
                where: {
                    OR: [
                        { senderId: companyId, status: 'ACCEPTED' },
                        { receiverId: companyId, status: 'ACCEPTED' },
                    ],
                },
            }),
        ]);
        return {
            jobsPosted,
            activeJobs,
            totalApplications,
            pendingApplications: 0,
            eventsOrganized,
            upcomingEvents,
            totalRegistrations,
            connections: connectionsCount,
        };
    }
    // Actividad reciente
    async getRecentActivity(userId, limit = 10) {
        const recentNotifications = await prisma_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return {
            notifications: recentNotifications.map(n => ({
                id: n.id,
                type: n.type,
                message: n.message,
                read: n.isRead,
                createdAt: n.createdAt,
                actor: null,
            })),
            messages: [],
        };
    }
    // Sugerencias y recomendaciones
    async getRecommendations(userId) {
        const [suggestedJobs, upcomingEvents, suggestedConnections] = await Promise.all([
            // Empleos recientes
            prisma_1.default.jobPost.findMany({
                where: { status: 'ACTIVE' },
                orderBy: { createdAt: 'desc' },
                take: 3,
                include: {
                    company: {
                        include: { companyProfile: true },
                    },
                },
            }),
            // Eventos próximos
            prisma_1.default.event.findMany({
                where: { status: 'PUBLISHED', startDate: { gte: new Date() } },
                orderBy: { startDate: 'asc' },
                take: 3,
                include: {
                    organizer: {
                        include: {
                            userProfile: true,
                            companyProfile: true,
                        },
                    },
                },
            }),
            // Usuarios sugeridos
            prisma_1.default.user.findMany({
                where: {
                    id: { not: userId },
                    NOT: {
                        OR: [
                            { sentConnections: { some: { receiverId: userId } } },
                            { receivedConnections: { some: { senderId: userId } } },
                        ],
                    },
                },
                take: 3,
                include: {
                    userProfile: true,
                    companyProfile: true,
                },
            }),
        ]);
        return {
            jobs: suggestedJobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company?.companyProfile?.companyName || 'Empresa',
                city: job.city,
                remote: job.remote,
            })),
            events: upcomingEvents.map(event => ({
                id: event.id,
                title: event.title,
                startDate: event.startDate,
                mode: event.mode,
                organizer: event.organizer?.companyProfile?.companyName
                    || (event.organizer?.userProfile
                        ? `${event.organizer.userProfile.firstName} ${event.organizer.userProfile.lastName}`
                        : 'Organizador'),
            })),
            connections: suggestedConnections.map(user => ({
                id: user.id,
                name: user.userProfile
                    ? `${user.userProfile.firstName} ${user.userProfile.lastName}`
                    : user.companyProfile?.companyName || 'Usuario',
                headline: user.userProfile?.headline || user.companyProfile?.description,
            })),
        };
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map