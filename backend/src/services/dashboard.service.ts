import prisma from '../config/prisma';

export class DashboardService {
  // Estadísticas para usuario individual
  async getUserStats(userId: string) {
    const [
      connectionsCount,
      pendingRequestsCount,
      postsCount,
      totalLikes,
      totalComments,
      applicationsCount,
      savedJobsCount,
      eventsRegisteredCount,
      unreadNotificationsCount,
    ] = await Promise.all([
      // Conexiones aceptadas
      prisma.connection.count({
        where: {
          OR: [
            { senderId: userId, status: 'ACCEPTED' },
            { receiverId: userId, status: 'ACCEPTED' },
          ],
        },
      }),
      // Solicitudes pendientes recibidas
      prisma.connection.count({
        where: { receiverId: userId, status: 'PENDING' },
      }),
      // Posts publicados
      prisma.post.count({
        where: { authorId: userId },
      }),
      // Total likes recibidos
      prisma.like.count({
        where: { post: { authorId: userId } },
      }),
      // Total comentarios recibidos
      prisma.comment.count({
        where: { post: { authorId: userId } },
      }),
      // Aplicaciones a empleos
      prisma.jobApplication.count({
        where: { applicantId: userId },
      }),
      // Empleos guardados
      prisma.savedJob.count({
        where: { userId },
      }),
      // Eventos registrados
      prisma.eventRegistration.count({
        where: { userId, status: { not: 'cancelled' } },
      }),
      // Notificaciones no leídas
      prisma.notification.count({
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
  async getCompanyStats(companyId: string) {
    const [
      jobsPosted,
      activeJobs,
      totalApplications,
      pendingApplications,
      eventsOrganized,
      upcomingEvents,
      totalRegistrations,
      connectionsCount,
    ] = await Promise.all([
      prisma.jobPost.count({ where: { companyId } }),
      prisma.jobPost.count({ where: { companyId, status: 'ACTIVE' } }),
      prisma.jobApplication.count({ where: { job: { companyId } } }),
      prisma.jobApplication.count({ where: { job: { companyId }, status: 'PENDING' } }),
      prisma.event.count({ where: { organizerId: companyId } }),
      prisma.event.count({ where: { organizerId: companyId, startDate: { gte: new Date() }, status: 'PUBLISHED' } }),
      prisma.eventRegistration.count({ where: { event: { organizerId: companyId } } }),
      prisma.connection.count({
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
      pendingApplications,
      eventsOrganized,
      upcomingEvents,
      totalRegistrations,
      connections: connectionsCount,
    };
  }

  // Actividad reciente
  async getRecentActivity(userId: string, limit: number = 10) {
    const recentNotifications = await prisma.notification.findMany({
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
  async getRecommendations(userId: string) {
    const [suggestedJobs, upcomingEvents, suggestedConnections] = await Promise.all([
      // Empleos recientes
      prisma.jobPost.findMany({
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
      prisma.event.findMany({
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
      prisma.user.findMany({
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
