"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class AdminService {
    // Estadísticas generales
    async getStats() {
        const [totalUsers, activeUsers, totalPosts, totalJobs, activeJobs, totalEvents, upcomingEvents, totalConnections,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({ where: { status: 'ACTIVE' } }),
            prisma_1.default.post.count(),
            prisma_1.default.jobPost.count(),
            prisma_1.default.jobPost.count({ where: { status: 'ACTIVE' } }),
            prisma_1.default.event.count(),
            prisma_1.default.event.count({ where: { startDate: { gte: new Date() } } }),
            prisma_1.default.connection.count({ where: { status: 'ACCEPTED' } }),
        ]);
        return {
            users: { total: totalUsers, active: activeUsers },
            posts: { total: totalPosts },
            jobs: { total: totalJobs, active: activeJobs },
            events: { total: totalEvents, upcoming: upcomingEvents },
            connections: { total: totalConnections },
        };
    }
    // Listar usuarios con filtros
    async getUsers(options) {
        const { page = 1, limit = 20, search, status, userType } = options;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { userProfile: { firstName: { contains: search, mode: 'insensitive' } } },
                { userProfile: { lastName: { contains: search, mode: 'insensitive' } } },
                { companyProfile: { companyName: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (userType) {
            where.userType = userType;
        }
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    userProfile: true,
                    companyProfile: true,
                    _count: {
                        select: {
                            posts: true,
                            sentConnections: true,
                        },
                    },
                },
            }),
            prisma_1.default.user.count({ where }),
        ]);
        return {
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                userType: user.userType,
                status: user.status,
                createdAt: user.createdAt,
                name: user.userProfile
                    ? `${user.userProfile.firstName} ${user.userProfile.lastName}`
                    : user.companyProfile?.companyName || 'Sin nombre',
                avatar: user.userProfile?.avatar || user.companyProfile?.logo,
                postsCount: user._count.posts,
                connectionsCount: user._count.sentConnections,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    // Actualizar estado de usuario
    async updateUserStatus(userId, status) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: { status: status },
        });
    }
    // Eliminar usuario (soft delete)
    async deleteUser(userId) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                status: 'SUSPENDED',
                deletedAt: new Date(),
            },
        });
    }
    // Listar posts con filtros
    async getPosts(options) {
        const { page = 1, limit = 20, search } = options;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.content = { contains: search, mode: 'insensitive' };
        }
        const [posts, total] = await Promise.all([
            prisma_1.default.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        include: {
                            userProfile: true,
                            companyProfile: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
            }),
            prisma_1.default.post.count({ where }),
        ]);
        return {
            posts: posts.map(post => ({
                id: post.id,
                content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
                createdAt: post.createdAt,
                authorName: post.author.userProfile
                    ? `${post.author.userProfile.firstName} ${post.author.userProfile.lastName}`
                    : post.author.companyProfile?.companyName || 'Usuario',
                authorId: post.author.id,
                likesCount: post._count.likes,
                commentsCount: post._count.comments,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    // Eliminar post
    async deletePost(postId) {
        return prisma_1.default.post.delete({
            where: { id: postId },
        });
    }
    // Listar empleos con filtros
    async getJobs(options) {
        const { page = 1, limit = 20, status } = options;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        const [jobs, total] = await Promise.all([
            prisma_1.default.jobPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    company: {
                        include: { companyProfile: true },
                    },
                    _count: {
                        select: { applications: true },
                    },
                },
            }),
            prisma_1.default.jobPost.count({ where }),
        ]);
        return {
            jobs: jobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company?.companyProfile?.companyName || 'Empresa',
                status: job.status,
                createdAt: job.createdAt,
                applicationsCount: job._count.applications,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    // Actualizar estado de empleo
    async updateJobStatus(jobId, status) {
        return prisma_1.default.jobPost.update({
            where: { id: jobId },
            data: { status: status },
        });
    }
    // Listar eventos con filtros
    async getEvents(options) {
        const { page = 1, limit = 20, status } = options;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        const [events, total] = await Promise.all([
            prisma_1.default.event.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
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
            }),
            prisma_1.default.event.count({ where }),
        ]);
        return {
            events: events.map(event => ({
                id: event.id,
                title: event.title,
                organizer: event.organizer?.companyProfile?.companyName
                    || (event.organizer?.userProfile
                        ? `${event.organizer.userProfile.firstName} ${event.organizer.userProfile.lastName}`
                        : 'Organizador'),
                status: event.status,
                startDate: event.startDate,
                registrationsCount: event._count.registrations,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    // Actualizar estado de evento
    async updateEventStatus(eventId, status) {
        return prisma_1.default.event.update({
            where: { id: eventId },
            data: { status: status },
        });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map