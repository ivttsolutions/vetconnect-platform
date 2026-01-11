export declare class AdminService {
    getStats(): Promise<{
        users: {
            total: any;
            active: any;
        };
        posts: {
            total: any;
        };
        jobs: {
            total: any;
            active: any;
        };
        events: {
            total: any;
            upcoming: any;
        };
        connections: {
            total: any;
        };
    }>;
    getUsers(options: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        userType?: string;
    }): Promise<{
        users: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    updateUserStatus(userId: string, status: string): Promise<any>;
    deleteUser(userId: string): Promise<any>;
    getPosts(options: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        posts: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    deletePost(postId: string): Promise<any>;
    getJobs(options: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        jobs: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    updateJobStatus(jobId: string, status: string): Promise<any>;
    getEvents(options: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        events: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    updateEventStatus(eventId: string, status: string): Promise<any>;
}
//# sourceMappingURL=admin.service.d.ts.map