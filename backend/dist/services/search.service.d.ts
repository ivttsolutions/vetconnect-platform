export declare class SearchService {
    searchAll(query: string, options?: {
        limit?: number;
    }): Promise<{
        users: any;
        jobs: any;
        events: any;
        posts: any;
    }>;
    searchUsers(query: string, options?: {
        limit?: number;
        offset?: number;
        userType?: string;
    }): Promise<any>;
}
//# sourceMappingURL=search.service.d.ts.map