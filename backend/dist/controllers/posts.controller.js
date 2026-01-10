"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const posts_service_1 = require("../services/posts.service");
const response_util_1 = require("../utils/response.util");
const postService = new posts_service_1.PostService();
class PostController {
    async createPost(req, res) {
        try {
            const userId = req.user.userId;
            const post = await postService.createPost(userId, req.body);
            (0, response_util_1.sendSuccess)(res, post, 'Publicación creada exitosamente', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getFeed(req, res) {
        try {
            const userId = req.user.userId;
            const { limit, offset } = req.query;
            const posts = await postService.getFeed(userId, {
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, posts, 'Feed obtenido exitosamente');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getPost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user?.userId;
            const post = await postService.getPost(postId, userId);
            (0, response_util_1.sendSuccess)(res, post, 'Publicación obtenida exitosamente');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 404);
        }
    }
    async getUserPosts(req, res) {
        try {
            const { userId } = req.params;
            const viewerId = req.user?.userId;
            const { limit, offset } = req.query;
            const posts = await postService.getUserPosts(userId, viewerId, {
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, posts, 'Publicaciones obtenidas exitosamente');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async likePost(req, res) {
        try {
            const userId = req.user.userId;
            const { postId } = req.params;
            const result = await postService.likePost(postId, userId);
            (0, response_util_1.sendSuccess)(res, result, result.liked ? 'Like añadido' : 'Like eliminado');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async addComment(req, res) {
        try {
            const userId = req.user.userId;
            const { postId } = req.params;
            const comment = await postService.addComment(postId, userId, req.body);
            (0, response_util_1.sendSuccess)(res, comment, 'Comentario añadido exitosamente', 201);
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async getComments(req, res) {
        try {
            const { postId } = req.params;
            const { limit, offset } = req.query;
            const comments = await postService.getComments(postId, {
                limit: limit ? parseInt(limit) : 20,
                offset: offset ? parseInt(offset) : 0,
            });
            (0, response_util_1.sendSuccess)(res, comments, 'Comentarios obtenidos exitosamente');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deletePost(req, res) {
        try {
            const userId = req.user.userId;
            const { postId } = req.params;
            await postService.deletePost(postId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Publicación eliminada exitosamente');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
    async deleteComment(req, res) {
        try {
            const userId = req.user.userId;
            const { commentId } = req.params;
            await postService.deleteComment(commentId, userId);
            (0, response_util_1.sendSuccess)(res, null, 'Comentario eliminado exitosamente');
        }
        catch (error) {
            (0, response_util_1.sendError)(res, error.message, 400);
        }
    }
}
exports.PostController = PostController;
//# sourceMappingURL=posts.controller.js.map