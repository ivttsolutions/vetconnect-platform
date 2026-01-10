"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class SearchService {
    async searchAll(query, options = {}) {
        const limit = options.limit || 10;
        // Buscar usuarios
        const users = await prisma_1.default.user.findMany({
            where: {
                OR: [
                    { userProfile: { firstName: { contains: query, mode: 'insensitive' } } },
                    { userProfile: { lastName: { contains: query, mode: 'insensitive' } } },
                    { userProfile: { headline: { contains: query, mode: 'insensitive' } } },
                    { companyProfile: { companyName: { contains: query, mode: 'insensitive' } } },
                ],
            },
            take: limit,
            include: {
                userProfile: true,
                companyProfile: true,
            },
        });
        // Buscar empleos
        const jobs = await prisma_1.default.jobPost.findMany({
            where: {
                status: 'ACTIVE',
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { city: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
            include: {
                company: {
                    include: { companyProfile: true },
                },
            },
        });
        // Buscar eventos
        const events = await prisma_1.default.event.findMany({
            where: {
                status: 'PUBLISHED',
                startDate: { gte: new Date() },
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { city: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
            include: {
                organizer: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
        });
        // Buscar posts
        const posts = await prisma_1.default.post.findMany({
            where: {
                OR: [
                    { content: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
            include: {
                author: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
            },
        });
        return {
            users: users.map(user => ({
                id: user.id,
                type: user.companyProfile ? 'COMPANY' : 'INDIVIDUAL',
                name: user.userProfile
                    ? `${user.userProfile.firstName} ${user.userProfile.lastName}`
                    : user.companyProfile?.companyName || 'Usuario',
                headline: user.userProfile?.headline || user.companyProfile?.description,
                avatar: user.userProfile?.avatar || user.companyProfile?.logo,
            })),
            jobs: jobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company?.companyProfile?.companyName || 'Empresa',
                city: job.city,
                remote: job.remote,
                jobType: job.jobType,
            })),
            events: events.map(event => ({
                id: event.id,
                title: event.title,
                type: event.type,
                mode: event.mode,
                startDate: event.startDate,
                city: event.city,
                organizer: event.organizer?.companyProfile?.companyName
                    || (event.organizer?.userProfile
                        ? `${event.organizer.userProfile.firstName} ${event.organizer.userProfile.lastName}`
                        : 'Organizador'),
            })),
            posts: posts.map(post => ({
                id: post.id,
                content: post.content.substring(0, 150) + (post.content.length > 150 ? '...' : ''),
                author: post.author?.companyProfile?.companyName
                    || (post.author?.userProfile
                        ? `${post.author.userProfile.firstName} ${post.author.userProfile.lastName}`
                        : 'Usuario'),
                createdAt: post.createdAt,
            })),
        };
    }
    async searchUsers(query, options = {}) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        const where = {
            OR: [
                { userProfile: { firstName: { contains: query, mode: 'insensitive' } } },
                { userProfile: { lastName: { contains: query, mode: 'insensitive' } } },
                { userProfile: { headline: { contains: query, mode: 'insensitive' } } },
                { companyProfile: { companyName: { contains: query, mode: 'insensitive' } } },
            ],
        };
        return prisma_1.default.user.findMany({
            where,
            take: limit,
            skip: offset,
            include: {
                userProfile: true,
                companyProfile: true,
            },
        });
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map