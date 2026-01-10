import prisma from '../config/prisma';

export class AdminService {
  // Estadísticas generales
  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalPosts,
      totalJobs,
      activeJobs,
      totalEvents,
      upcomingEvents,
      totalConnections,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.post.count(),
      prisma.jobPost.count(),
      prisma.jobPost.count({ where: { status: 'ACTIVE' } }),
      prisma.event.count(),
      prisma.event.count({ where: { startDate: { gte: new Date() } } }),
      prisma.connection.count({ where: { status: 'ACCEPTED' } }),
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
  async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userType?: string;
  }) {
    const { page = 1, limit = 20, search, status, userType } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

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
      prisma.user.findMany({
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
      prisma.user.count({ where }),
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
  async updateUserStatus(userId: string, status: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
    });
  }

  // Eliminar usuario (soft delete)
  async deleteUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { 
        status: 'SUSPENDED' as any,
        deletedAt: new Date(),
      },
    });
  }

  // Listar posts con filtros
  async getPosts(options: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { page = 1, limit = 20, search } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.content = { contains: search, mode: 'insensitive' };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
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
      prisma.post.count({ where }),
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
  async deletePost(postId: string) {
    return prisma.post.delete({
      where: { id: postId },
    });
  }

  // Listar empleos con filtros
  async getJobs(options: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [jobs, total] = await Promise.all([
      prisma.jobPost.findMany({
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
      prisma.jobPost.count({ where }),
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
  async updateJobStatus(jobId: string, status: string) {
    return prisma.jobPost.update({
      where: { id: jobId },
      data: { status: status as any },
    });
  }

  // Listar eventos con filtros
  async getEvents(options: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
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
      prisma.event.count({ where }),
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
  async updateEventStatus(eventId: string, status: string) {
    return prisma.event.update({
      where: { id: eventId },
      data: { status: status as any },
    });
  }
}
