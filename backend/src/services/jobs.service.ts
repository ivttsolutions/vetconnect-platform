import prisma from '../config/prisma';

export class JobsService {
  // Crear oferta de empleo
  async createJob(companyId: string, data: {
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    benefits?: string;
    jobType: string;
    location: string;
    country?: string;
    city?: string;
    remote?: boolean;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    showSalary?: boolean;
    experienceYears?: number;
    specialization?: string[];
    skills?: string[];
    educationLevel?: string;
    applicationDeadline?: Date;
    externalUrl?: string;
    applicationEmail?: string;
  }) {
    return prisma.jobPost.create({
      data: {
        companyId,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        jobType: data.jobType as any,
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
  async getJobs(options: {
    limit?: number;
    offset?: number;
    jobType?: string;
    location?: string;
    remote?: boolean;
    search?: string;
  } = {}) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const where: any = {
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

    const jobs = await prisma.jobPost.findMany({
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
  async getJob(jobId: string, userId?: string) {
    const job = await prisma.jobPost.findUnique({
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
    await prisma.jobPost.update({
      where: { id: jobId },
      data: { viewsCount: { increment: 1 } },
    });

    // Verificar si el usuario ya aplicó
    let hasApplied = false;
    let isSaved = false;

    if (userId) {
      const application = await prisma.jobApplication.findUnique({
        where: {
          jobId_applicantId: { jobId, applicantId: userId },
        },
      });
      hasApplied = !!application;

      const saved = await prisma.savedJob.findUnique({
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
  async applyToJob(jobId: string, applicantId: string, data: {
    coverLetter?: string;
    resumeUrl?: string;
  }) {
    const job = await prisma.jobPost.findUnique({
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
    const existing = await prisma.jobApplication.findUnique({
      where: {
        jobId_applicantId: { jobId, applicantId },
      },
    });

    if (existing) {
      throw new Error('Ya has aplicado a este empleo');
    }

    const application = await prisma.jobApplication.create({
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
    await prisma.jobPost.update({
      where: { id: jobId },
      data: { applicationsCount: { increment: 1 } },
    });

    return application;
  }

  // Guardar empleo
  async saveJob(userId: string, jobId: string) {
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: { userId, jobId },
      },
    });

    if (existing) {
      // Eliminar guardado
      await prisma.savedJob.delete({
        where: { id: existing.id },
      });
      return { saved: false };
    }

    await prisma.savedJob.create({
      data: { userId, jobId },
    });

    return { saved: true };
  }

  // Obtener empleos guardados
  async getSavedJobs(userId: string) {
    const saved = await prisma.savedJob.findMany({
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
  async getMyApplications(userId: string) {
    return prisma.jobApplication.findMany({
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
  async getCompanyJobs(companyId: string) {
    return prisma.jobPost.findMany({
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
  async getJobApplications(jobId: string, companyId: string) {
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job || job.companyId !== companyId) {
      throw new Error('No tienes acceso a estas aplicaciones');
    }

    return prisma.jobApplication.findMany({
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
  async updateApplicationStatus(applicationId: string, companyId: string, status: string) {
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application || application.job.companyId !== companyId) {
      throw new Error('No tienes acceso a esta aplicación');
    }

    return prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: status as any,
        viewedAt: status !== 'APPLIED' ? new Date() : undefined,
      },
    });
  }

  // Cerrar empleo
  async closeJob(jobId: string, companyId: string) {
    const job = await prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job || job.companyId !== companyId) {
      throw new Error('No tienes acceso a este empleo');
    }

    return prisma.jobPost.update({
      where: { id: jobId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });
  }
}
