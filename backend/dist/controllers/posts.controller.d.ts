import { Response } from 'express';
import { AuthRequest } from '../types';
export declare class PostController {
    createPost(req: AuthRequest, res: Response): Promise<void>;
    getFeed(req: AuthRequest, res: Response): Promise<void>;
    getPost(req: AuthRequest, res: Response): Promise<void>;
    getUserPosts(req: AuthRequest, res: Response): Promise<void>;
    likePost(req: AuthRequest, res: Response): Promise<void>;
    addComment(req: AuthRequest, res: Response): Promise<void>;
    getComments(req: AuthRequest, res: Response): Promise<void>;
    deletePost(req: AuthRequest, res: Response): Promise<void>;
    deleteComment(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=posts.controller.d.ts.map