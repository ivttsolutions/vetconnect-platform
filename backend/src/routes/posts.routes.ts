import { Router } from 'express';
import { PostController } from '../controllers/posts.controller';
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware';

const router = Router();
const postController = new PostController();

// Feed (requires auth)
router.get('/feed', authMiddleware, (req, res) => postController.getFeed(req, res));

// Create post (requires auth)
router.post('/', authMiddleware, (req, res) => postController.createPost(req, res));

// Get single post (optional auth for like status)
router.get('/:postId', optionalAuth, (req, res) => postController.getPost(req, res));

// Get user's posts (optional auth)
router.get('/user/:userId', optionalAuth, (req, res) => postController.getUserPosts(req, res));

// Like/unlike post (requires auth)
router.post('/:postId/like', authMiddleware, (req, res) => postController.likePost(req, res));

// Comments
router.get('/:postId/comments', (req, res) => postController.getComments(req, res));
router.post('/:postId/comments', authMiddleware, (req, res) => postController.addComment(req, res));
router.delete('/comments/:commentId', authMiddleware, (req, res) => postController.deleteComment(req, res));

// Delete post (requires auth)
router.delete('/:postId', authMiddleware, (req, res) => postController.deletePost(req, res));

export default router;
