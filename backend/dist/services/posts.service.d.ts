export declare class PostService {
    createPost(userId: string, data: {
        content?: string;
        type?: string;
        visibility?: string;
        images?: string[];
    }): Promise<any>;
    getFeed(userId: string, options: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    getPost(postId: string, userId?: string): Promise<any>;
    getUserPosts(userId: string, viewerId?: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    likePost(postId: string, userId: string): Promise<{
        liked: boolean;
    }>;
    addComment(postId: string, userId: string, data: {
        content: string;
        parentId?: string;
    }): Promise<any>;
    getComments(postId: string, options?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    deletePost(postId: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    deleteComment(commentId: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
//# sourceMappingURL=posts.service.d.ts.map