export declare class DashboardService {
    getUserStats(userId: string): Promise<{
        connections: number;
        pendingRequests: number;
        posts: number;
        totalLikes: number;
        totalComments: number;
        applications: number;
        savedJobs: number;
        eventsRegistered: number;
        unreadMessages: number;
        unreadNotifications: number;
    }>;
    getCompanyStats(companyId: string): Promise<{
        jobsPosted: number;
        activeJobs: number;
        totalApplications: number;
        pendingApplications: number;
        eventsOrganized: number;
        upcomingEvents: number;
        totalRegistrations: number;
        connections: number;
    }>;
    getRecentActivity(userId: string, limit?: number): Promise<{
        notifications: {
            id: string;
            type: import(".prisma/client").$Enums.NotificationType;
            message: string;
            read: boolean;
            createdAt: Date;
            actor: any;
        }[];
        messages: any[];
    }>;
    getRecommendations(userId: string): Promise<{
        jobs: {
            id: string;
            title: string;
            company: string;
            city: string;
            remote: boolean;
        }[];
        events: {
            id: string;
            title: string;
            startDate: Date;
            mode: import(".prisma/client").$Enums.EventMode;
            organizer: string;
        }[];
        connections: {
            id: string;
            name: string;
            headline: string;
        }[];
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map