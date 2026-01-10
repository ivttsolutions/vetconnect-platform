import prisma from '../config/prisma';

export class SearchService {
  async searchAll(query: string, options: { limit?: number } = {}) {
    const limit = options.limit || 10;
    const searchTerm = `%${query}%`;

    // Buscar usuarios
    const users = await prisma.user.findMany({
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
    const jobs = await prisma.job.findMany({
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
    const events = await prisma.event.findMany({
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
    const posts = await prisma.post.findMany({
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
        type: user.accountType,
        name: user.userProfile 
          ? `${user.userProfile.firstName} ${user.userProfile.lastName}`
          : user.companyProfile?.companyName || 'Usuario',
        headline: user.userProfile?.headline || user.companyProfile?.description,
        avatar: user.userProfile?.avatar || user.companyProfile?.logo,
        userType: user.userProfile?.userType,
        companyType: user.companyProfile?.companyType,
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

  async searchUsers(query: string, options: { limit?: number; offset?: number; userType?: string } = {}) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const where: any = {
      OR: [
        { userProfile: { firstName: { contains: query, mode: 'insensitive' } } },
        { userProfile: { lastName: { contains: query, mode: 'insensitive' } } },
        { userProfile: { headline: { contains: query, mode: 'insensitive' } } },
        { companyProfile: { companyName: { contains: query, mode: 'insensitive' } } },
      ],
    };

    if (options.userType) {
      where.userProfile = { ...where.userProfile, userType: options.userType };
    }

    return prisma.user.findMany({
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
