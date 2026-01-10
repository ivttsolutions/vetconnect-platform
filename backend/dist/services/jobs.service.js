"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class JobsService {
    // Crear oferta de empleo
    async createJob(companyId, data) {
        return prisma_1.default.jobPost.create({
            data: {
                companyId,
                title: data.title,
                description: data.description,
                requirements: data.requirements,
                responsibilities: data.responsibilities,
                benefits: data.benefits,
                jobType: data.jobType,
                status: 'ACTIVE',
                location: data.location,
                country: data.country,
                city: data.city,
                remote: data.remote || false,
                salaryMin: data.salaryMin,
                salaryMax: data.salaryMax,
                salaryCurrency: data.salaryCurrency || 'EUR',
                showSalary: data.showSalary || false,
                experienceYears: data.experienceYears,
                specialization: data.specialization || [],
                skills: data.skills || [],
                educationLevel: data.educationLevel,
                applicationDeadline: data.applicationDeadline,
                externalUrl: data.externalUrl,
                applicationEmail: data.applicationEmail,
                publishedAt: new Date(),
            },
            include: {
                company: {
                    include: {
                        companyProfile: true,
                    },
                },
            },
        });
    }
    // Obtener empleos públicos
    async getJobs(options = {}) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        const where = {
            status: 'ACTIVE',
        };
        if (options.jobType) {
            where.jobType = options.jobType;
        }
        if (options.location) {
            where.OR = [
                { location: { contains: options.location, mode: 'insensitive' } },
                { city: { contains: options.location, mode: 'insensitive' } },
                { country: { contains: options.location, mode: 'insensitive' } },
            ];
        }
        if (options.remote !== undefined) {
            where.remote = options.remote;
        }
        if (options.search) {
            where.AND = [
                {
                    OR: [
                        { title: { contains: options.search, mode: 'insensitive' } },
                        { description: { contains: options.search, mode: 'insensitive' } },
                        { skills: { hasSome: [options.search] } },
                    ],
                },
            ];
        }
        const jobs = await prisma_1.default.jobPost.findMany({
            where,
            orderBy: [
                { isSponsored: 'desc' },
                { createdAt: 'desc' },
            ],
            take: limit,
            skip: offset,
            include: {
                company: {
                    include: {
                        companyProfile: true,
                    },
                },
                _count: {
                    select: { applications: true },
                },
            },
        });
        return jobs;
    }
    // Obtener detalle de un empleo
    async getJob(jobId, userId) {
        const job = await prisma_1.default.jobPost.findUnique({
            where: { id: jobId },
            include: {
                company: {
                    include: {
                        companyProfile: true,
                    },
                },
                _count: {
                    select: { applications: true },
                },
            },
        });
        if (!job) {
            throw new Error('Empleo no encontrado');
        }
        // Incrementar vistas
        await prisma_1.default.jobPost.update({
            where: { id: jobId },
            data: { viewsCount: { increment: 1 } },
        });
        // Verificar si el usuario ya aplicó
        let hasApplied = false;
        let isSaved = false;
        if (userId) {
            const application = await prisma_1.default.jobApplication.findUnique({
                where: {
                    jobId_applicantId: { jobId, applicantId: userId },
                },
            });
            hasApplied = !!application;
            const saved = await prisma_1.default.savedJob.findUnique({
                where: {
                    userId_jobId: { userId, jobId },
                },
            });
            isSaved = !!saved;
        }
        return {
            ...job,
            hasApplied,
            isSaved,
        };
    }
    // Aplicar a un empleo
    async applyToJob(jobId, applicantId, data) {
        const job = await prisma_1.default.jobPost.findUnique({
            where: { id: jobId },
        });
        if (!job || job.status !== 'ACTIVE') {
            throw new Error('Este empleo no está disponible');
        }
        // Verificar que no sea el mismo usuario
        if (job.companyId === applicantId) {
            throw new Error('No puedes aplicar a tu propia oferta');
        }
        // Verificar aplicación existente
        const existing = await prisma_1.default.jobApplication.findUnique({
            where: {
                jobId_applicantId: { jobId, applicantId },
            },
        });
        if (existing) {
            throw new Error('Ya has aplicado a este empleo');
        }
        const application = await prisma_1.default.jobApplication.create({
            data: {
                jobId,
                applicantId,
                coverLetter: data.coverLetter,
                resumeUrl: data.resumeUrl,
                status: 'APPLIED',
            },
            include: {
                job: {
                    include: {
                        company: {
                            include: {
                                companyProfile: true,
                            },
                        },
                    },
                },
                applicant: {
                    include: {
                        userProfile: true,
                    },
                },
            },
        });
        // Actualizar contador
        await prisma_1.default.jobPost.update({
            where: { id: jobId },
            data: { applicationsCount: { increment: 1 } },
        });
        return application;
    }
    // Guardar empleo
    async saveJob(userId, jobId) {
        const existing = await prisma_1.default.savedJob.findUnique({
            where: {
                userId_jobId: { userId, jobId },
            },
        });
        if (existing) {
            // Eliminar guardado
            await prisma_1.default.savedJob.delete({
                where: { id: existing.id },
            });
            return { saved: false };
        }
        await prisma_1.default.savedJob.create({
            data: { userId, jobId },
        });
        return { saved: true };
    }
    // Obtener empleos guardados
    async getSavedJobs(userId) {
        const saved = await prisma_1.default.savedJob.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                job: {
                    include: {
                        company: {
                            include: {
                                companyProfile: true,
                            },
                        },
                    },
                },
            },
        });
        return saved.map(s => s.job);
    }
    // Obtener mis aplicaciones
    async getMyApplications(userId) {
        return prisma_1.default.jobApplication.findMany({
            where: { applicantId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                job: {
                    include: {
                        company: {
                            include: {
                                companyProfile: true,
                            },
                        },
                    },
                },
            },
        });
    }
    // Obtener empleos publicados por una empresa
    async getCompanyJobs(companyId) {
        return prisma_1.default.jobPost.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true },
                },
            },
        });
    }
    // Obtener aplicaciones a un empleo (para la empresa)
    async getJobApplications(jobId, companyId) {
        const job = await prisma_1.default.jobPost.findUnique({
            where: { id: jobId },
        });
        if (!job || job.companyId !== companyId) {
            throw new Error('No tienes acceso a estas aplicaciones');
        }
        return prisma_1.default.jobApplication.findMany({
            where: { jobId },
            orderBy: { createdAt: 'desc' },
            include: {
                applicant: {
                    include: {
                        userProfile: true,
                    },
                },
            },
        });
    }
    // Actualizar estado de aplicación
    async updateApplicationStatus(applicationId, companyId, status) {
        const application = await prisma_1.default.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true },
        });
        if (!application || application.job.companyId !== companyId) {
            throw new Error('No tienes acceso a esta aplicación');
        }
        return prisma_1.default.jobApplication.update({
            where: { id: applicationId },
            data: {
                status: status,
                viewedAt: status !== 'APPLIED' ? new Date() : undefined,
            },
        });
    }
    // Cerrar empleo
    async closeJob(jobId, companyId) {
        const job = await prisma_1.default.jobPost.findUnique({
            where: { id: jobId },
        });
        if (!job || job.companyId !== companyId) {
            throw new Error('No tienes acceso a este empleo');
        }
        return prisma_1.default.jobPost.update({
            where: { id: jobId },
            data: {
                status: 'CLOSED',
                closedAt: new Date(),
            },
        });
    }
}
exports.JobsService = JobsService;
//# sourceMappingURL=jobs.service.js.map