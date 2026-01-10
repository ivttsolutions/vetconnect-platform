import prisma from '../config/prisma';
import { UploadService } from './upload.service';

const uploadService = new UploadService();

export class PostService {
  async createPost(userId: string, data: {
    content?: string;
    type?: string;
    visibility?: string;
    images?: string[];
  }) {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content: data.content,
        type: (data.type as any) || 'STANDARD',
        visibility: (data.visibility as any) || 'PUBLIC',
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

  async getFeed(userId: string, options: { limit?: number; offset?: number }) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    // Get posts from connections and public posts
    const posts = await prisma.post.findMany({
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

  async getPost(postId: string, userId?: string) {
    const post = await prisma.post.findUnique({
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
    await prisma.post.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
    });

    return {
      ...post,
      isLiked: userId ? (post.likes as any[])?.length > 0 : false,
      likes: undefined,
    };
  }

  async getUserPosts(userId: string, viewerId?: string, options: { limit?: number; offset?: number } = {}) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    const posts = await prisma.post.findMany({
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
      isLiked: viewerId ? (post.likes as any[])?.length > 0 : false,
      likes: undefined,
    }));
  }

  async likePost(postId: string, userId: string) {
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      // Like
      await prisma.like.create({
        data: { userId, postId },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  async addComment(postId: string, userId: string, data: { content: string; parentId?: string }) {
    const comment = await prisma.comment.create({
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
    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    return comment;
  }

  async getComments(postId: string, options: { limit?: number; offset?: number } = {}) {
    const limit = options.limit || 20;
    const offset = options.offset || 0;

    return prisma.comment.findMany({
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

  async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('Not authorized to delete this post');
    }

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    return { deleted: true };
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new Error('Not authorized to delete this comment');
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });

    // Update comment count
    await prisma.post.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    });

    return { deleted: true };
  }
}
