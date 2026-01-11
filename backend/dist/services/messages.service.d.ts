export declare class MessagesService {
    getOrCreateConversation(userId1: string, userId2: string): Promise<any>;
    getConversations(userId: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    getMessages(conversationId: string, userId: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    sendMessage(conversationId: string, senderId: string, content: string, messageType?: string): Promise<any>;
    startConversation(senderId: string, receiverId: string, content: string): Promise<{
        conversation: any;
        message: any;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(conversationId: string, userId: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=messages.service.d.ts.map