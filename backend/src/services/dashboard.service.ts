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
      unreadMessagesCount,
      unreadNotificationsCount,
      profileViews,
    ] = await Promise.all([
      // Conexiones aceptadas
      prisma.connection.count({
        where: {
          OR: [
            { requesterId: userId, status: 'ACCEPTED' },
            { addresseeId: userId, status: 'ACCEPTED' },
          ],
        },
      }),
      // Solicitudes pendientes recibidas
      prisma.connection.count({
        where: { addresseeId: userId, status: 'PENDING' },
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
      // Mensajes no leídos
      prisma.conversation.count({
        where: {
          participants: { some: { id: userId } },
          messages: {
            some: {
              senderId: { not: userId },
              createdAt: {
                gt: prisma.conversation.fields.lastReadAt,
              },
            },
          },
        },
      }),
      // Notificaciones no leídas
      prisma.notification.count({
        where: { userId, read: false },
      }),
      // Vistas de perfil (últimos 30 días) - placeholder
      Promise.resolve(0),
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
      unreadMessages: unreadMessagesCount,
      unreadNotifications: unreadNotificationsCount,
      profileViews,
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
      // Total empleos publicados
      prisma.jobPost.count({
        where: { companyId },
      }),
      // Empleos activos
      prisma.jobPost.count({
        where: { companyId, status: 'ACTIVE' },
      }),
      // Total aplicaciones recibidas
      prisma.jobApplication.count({
        where: { job: { companyId } },
      }),
      // Aplicaciones pendientes
      prisma.jobApplication.count({
        where: { job: { companyId }, status: 'PENDING' },
      }),
      // Eventos organizados
      prisma.event.count({
        where: { organizerId: companyId },
      }),
      // Eventos próximos
      prisma.event.count({
        where: { organizerId: companyId, startDate: { gte: new Date() }, status: 'PUBLISHED' },
      }),
      // Total inscripciones a eventos
      prisma.eventRegistration.count({
        where: { event: { organizerId: companyId } },
      }),
      // Conexiones
      prisma.connection.count({
        where: {
          OR: [
            { requesterId: companyId, status: 'ACCEPTED' },
            { addresseeId: companyId, status: 'ACCEPTED' },
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
    const [recentNotifications, recentMessages] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          actor: {
            include: {
              userProfile: true,
              companyProfile: true,
            },
          },
        },
      }),
      prisma.message.findMany({
        where: {
          conversation: {
            participants: { some: { id: userId } },
          },
          senderId: { not: userId },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          sender: {
            include: {
              userProfile: true,
              companyProfile: true,
            },
          },
        },
      }),
    ]);

    return {
      notifications: recentNotifications.map(n => ({
        id: n.id,
        type: n.type,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt,
        actor: n.actor?.userProfile 
          ? `${n.actor.userProfile.firstName} ${n.actor.userProfile.lastName}`
          : n.actor?.companyProfile?.companyName || null,
      })),
      messages: recentMessages.map(m => ({
        id: m.id,
        content: m.content.substring(0, 50) + (m.content.length > 50 ? '...' : ''),
        createdAt: m.createdAt,
        sender: m.sender?.userProfile 
          ? `${m.sender.userProfile.firstName} ${m.sender.userProfile.lastName}`
          : m.sender?.companyProfile?.companyName || 'Usuario',
      })),
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
              { sentConnections: { some: { addresseeId: userId } } },
              { receivedConnections: { some: { requesterId: userId } } },
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
