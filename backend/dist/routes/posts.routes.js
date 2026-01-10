"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_controller_1 = require("../controllers/posts.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const postController = new posts_controller_1.PostController();
// Feed (requires auth)
router.get('/feed', auth_middleware_1.authMiddleware, (req, res) => postController.getFeed(req, res));
// Create post (requires auth)
router.post('/', auth_middleware_1.authMiddleware, (req, res) => postController.createPost(req, res));
// Get single post (optional auth for like status)
router.get('/:postId', auth_middleware_1.optionalAuth, (req, res) => postController.getPost(req, res));
// Get user's posts (optional auth)
router.get('/user/:userId', auth_middleware_1.optionalAuth, (req, res) => postController.getUserPosts(req, res));
// Like/unlike post (requires auth)
router.post('/:postId/like', auth_middleware_1.authMiddleware, (req, res) => postController.likePost(req, res));
// Comments
router.get('/:postId/comments', (req, res) => postController.getComments(req, res));
router.post('/:postId/comments', auth_middleware_1.authMiddleware, (req, res) => postController.addComment(req, res));
router.delete('/comments/:commentId', auth_middleware_1.authMiddleware, (req, res) => postController.deleteComment(req, res));
// Delete post (requires auth)
router.delete('/:postId', auth_middleware_1.authMiddleware, (req, res) => postController.deletePost(req, res));
exports.default = router;
//# sourceMappingURL=posts.routes.js.map