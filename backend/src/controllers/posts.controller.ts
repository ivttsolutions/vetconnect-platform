import { Response } from 'express';
import { PostService } from '../services/posts.service';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response.util';

const postService = new PostService();

export class PostController {
  async createPost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const post = await postService.createPost(userId, req.body);
      sendSuccess(res, post, 'Publicación creada exitosamente', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getFeed(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { limit, offset } = req.query;
      const posts = await postService.getFeed(userId, {
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      sendSuccess(res, posts, 'Feed obtenido exitosamente');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getPost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = req.user?.userId;
      const post = await postService.getPost(postId, userId);
      sendSuccess(res, post, 'Publicación obtenida exitosamente');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async getUserPosts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const viewerId = req.user?.userId;
      const { limit, offset } = req.query;
      const posts = await postService.getUserPosts(userId, viewerId, {
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      sendSuccess(res, posts, 'Publicaciones obtenidas exitosamente');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async likePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { postId } = req.params;
      const result = await postService.likePost(postId, userId);
      sendSuccess(res, result, result.liked ? 'Like añadido' : 'Like eliminado');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async addComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { postId } = req.params;
      const comment = await postService.addComment(postId, userId, req.body);
      sendSuccess(res, comment, 'Comentario añadido exitosamente', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getComments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { limit, offset } = req.query;
      const comments = await postService.getComments(postId, {
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      sendSuccess(res, comments, 'Comentarios obtenidos exitosamente');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deletePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { postId } = req.params;
      await postService.deletePost(postId, userId);
      sendSuccess(res, null, 'Publicación eliminada exitosamente');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { commentId } = req.params;
      await postService.deleteComment(commentId, userId);
      sendSuccess(res, null, 'Comentario eliminado exitosamente');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
