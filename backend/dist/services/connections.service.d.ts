export declare class ConnectionService {
    sendRequest(senderId: string, receiverId: string, message?: string): Promise<any>;
    acceptRequest(connectionId: string, userId: string): Promise<any>;
    rejectRequest(connectionId: string, userId: string): Promise<{
        rejected: boolean;
    }>;
    cancelRequest(connectionId: string, userId: string): Promise<{
        cancelled: boolean;
    }>;
    removeConnection(connectionId: string, userId: string): Promise<{
        removed: boolean;
    }>;
    getPendingRequests(userId: string): Promise<any>;
    getSentRequests(userId: string): Promise<any>;
    getConnections(userId: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    getConnectionsCount(userId: string): Promise<any>;
    getConnectionStatus(userId: string, targetUserId: string): Promise<{
        status: string;
        connectionId: any;
        isSender?: undefined;
    } | {
        status: any;
        connectionId: any;
        isSender: boolean;
    }>;
    searchUsers(userId: string, query: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    getSuggestions(userId: string, limit?: number): Promise<any>;
}
//# sourceMappingURL=connections.service.d.ts.map