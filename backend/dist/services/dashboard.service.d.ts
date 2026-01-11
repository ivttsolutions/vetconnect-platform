export declare class DashboardService {
    getUserStats(userId: string): Promise<{
        connections: any;
        pendingRequests: any;
        posts: any;
        totalLikes: any;
        totalComments: any;
        applications: any;
        savedJobs: any;
        eventsRegistered: any;
        unreadMessages: number;
        unreadNotifications: any;
    }>;
    getCompanyStats(companyId: string): Promise<{
        jobsPosted: any;
        activeJobs: any;
        totalApplications: any;
        pendingApplications: number;
        eventsOrganized: any;
        upcomingEvents: any;
        totalRegistrations: any;
        connections: any;
    }>;
    getRecentActivity(userId: string, limit?: number): Promise<{
        notifications: any;
        messages: any[];
    }>;
    getRecommendations(userId: string): Promise<{
        jobs: any;
        events: any;
        connections: any;
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map