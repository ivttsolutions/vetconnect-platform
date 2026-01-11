export declare class NotificationService {
    create(data: {
        userId: string;
        type: string;
        title: string;
        message: string;
        actionUrl?: string;
        actorId?: string;
        postId?: string;
        commentId?: string;
        jobId?: string;
        eventId?: string;
    }): Promise<any>;
    getNotifications(userId: string, options?: {
        limit?: number;
        offset?: number;
        unreadOnly?: boolean;
    }): Promise<any[]>;
    getUnreadCount(userId: string): Promise<any>;
    markAsRead(notificationId: string, userId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    delete(notificationId: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    notifyConnectionRequest(senderId: string, receiverId: string): Promise<any>;
    notifyConnectionAccepted(accepterId: string, senderId: string): Promise<any>;
    notifyPostLike(likerId: string, postAuthorId: string, postId: string): Promise<any>;
    notifyPostComment(commenterId: string, postAuthorId: string, postId: string, commentId?: string): Promise<any>;
    notifyNewMessage(senderId: string, receiverId: string, conversationId: string): Promise<any>;
}
//# sourceMappingURL=notifications.service.d.ts.map