"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const upload_service_1 = require("./upload.service");
const uploadService = new upload_service_1.UploadService();
class PostService {
    async createPost(userId, data) {
        const post = await prisma_1.default.post.create({
            data: {
                authorId: userId,
                content: data.content,
                type: data.type || 'STANDARD',
                visibility: data.visibility || 'PUBLIC',
                images: data.images || [],
            },
            include: {
                author: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });
        return post;
    }
    async getFeed(userId, options) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        // Get posts from connections and public posts
        const posts = await prisma_1.default.post.findMany({
            where: {
                deletedAt: null,
                isHidden: false,
                OR: [
                    { visibility: 'PUBLIC' },
                    { authorId: userId },
                    {
                        AND: [
                            { visibility: 'CONNECTIONS' },
                            {
                                author: {
                                    OR: [
                                        {
                                            sentConnections: {
                                                some: {
                                                    receiverId: userId,
                                                    status: 'ACCEPTED',
                                                },
                                            },
                                        },
                                        {
                                            receivedConnections: {
                                                some: {
                                                    senderId: userId,
                                                    status: 'ACCEPTED',
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                author: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
                likes: {
                    where: { userId },
                    select: { id: true },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        shares: true,
                    },
                },
            },
        });
        // Transform to include isLiked flag
        return posts.map(post => ({
            ...post,
            isLiked: post.likes.length > 0,
            likes: undefined,
        }));
    }
    async getPost(postId, userId) {
        const post = await prisma_1.default.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
                comments: {
                    where: { deletedAt: null, parentId: null },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        author: {
                            include: {
                                userProfile: true,
                            },
                        },
                        _count: {
                            select: { likes: true, replies: true },
                        },
                    },
                },
                likes: userId ? {
                    where: { userId },
                    select: { id: true },
                } : false,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        shares: true,
                    },
                },
            },
        });
        if (!post) {
            throw new Error('Post not found');
        }
        // Increment view count
        await prisma_1.default.post.update({
            where: { id: postId },
            data: { viewsCount: { increment: 1 } },
        });
        return {
            ...post,
            isLiked: userId ? post.likes?.length > 0 : false,
            likes: undefined,
        };
    }
    async getUserPosts(userId, viewerId, options = {}) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        const posts = await prisma_1.default.post.findMany({
            where: {
                authorId: userId,
                deletedAt: null,
                isHidden: false,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                author: {
                    include: {
                        userProfile: true,
                        companyProfile: true,
                    },
                },
                likes: viewerId ? {
                    where: { userId: viewerId },
                    select: { id: true },
                } : false,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        shares: true,
                    },
                },
            },
        });
        return posts.map(post => ({
            ...post,
            isLiked: viewerId ? post.likes?.length > 0 : false,
            likes: undefined,
        }));
    }
    async likePost(postId, userId) {
        // Check if already liked
        const existingLike = await prisma_1.default.like.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });
        if (existingLike) {
            // Unlike
            await prisma_1.default.like.delete({
                where: { id: existingLike.id },
            });
            await prisma_1.default.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } },
            });
            return { liked: false };
        }
        else {
            // Like
            await prisma_1.default.like.create({
                data: { userId, postId },
            });
            await prisma_1.default.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } },
            });
            return { liked: true };
        }
    }
    async addComment(postId, userId, data) {
        const comment = await prisma_1.default.comment.create({
            data: {
                postId,
                authorId: userId,
                content: data.content,
                parentId: data.parentId,
            },
            include: {
                author: {
                    include: {
                        userProfile: true,
                    },
                },
            },
        });
        // Update comment count
        await prisma_1.default.post.update({
            where: { id: postId },
            data: { commentsCount: { increment: 1 } },
        });
        return comment;
    }
    async getComments(postId, options = {}) {
        const limit = options.limit || 20;
        const offset = options.offset || 0;
        return prisma_1.default.comment.findMany({
            where: {
                postId,
                deletedAt: null,
                parentId: null,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                author: {
                    include: {
                        userProfile: true,
                    },
                },
                replies: {
                    where: { deletedAt: null },
                    take: 3,
                    orderBy: { createdAt: 'asc' },
                    include: {
                        author: {
                            include: {
                                userProfile: true,
                            },
                        },
                    },
                },
                _count: {
                    select: { likes: true, replies: true },
                },
            },
        });
    }
    async deletePost(postId, userId) {
        const post = await prisma_1.default.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new Error('Post not found');
        }
        if (post.authorId !== userId) {
            throw new Error('Not authorized to delete this post');
        }
        await prisma_1.default.post.update({
            where: { id: postId },
            data: { deletedAt: new Date() },
        });
        return { deleted: true };
    }
    async deleteComment(commentId, userId) {
        const comment = await prisma_1.default.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new Error('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new Error('Not authorized to delete this comment');
        }
        await prisma_1.default.comment.update({
            where: { id: commentId },
            data: { deletedAt: new Date() },
        });
        // Update comment count
        await prisma_1.default.post.update({
            where: { id: comment.postId },
            data: { commentsCount: { decrement: 1 } },
        });
        return { deleted: true };
    }
}
exports.PostService = PostService;
//# sourceMappingURL=posts.service.js.map