import api from './api';

export const postsApi = {
  // Get feed
  getFeed: async (limit = 20, offset = 0) => {
    const response = await api.get(`/posts/feed?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Create post
  createPost: async (data: { content: string; visibility?: string }) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // Get single post
  getPost: async (postId: string) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Get user's posts
  getUserPosts: async (userId: string, limit = 20, offset = 0) => {
    const response = await api.get(`/posts/user/${userId}?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Like/unlike post
  likePost: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Get comments
  getComments: async (postId: string, limit = 20, offset = 0) => {
    const response = await api.get(`/posts/${postId}/comments?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Add comment
  addComment: async (postId: string, content: string, parentId?: string) => {
    const response = await api.post(`/posts/${postId}/comments`, { content, parentId });
    return response.data;
  },

  // Delete post
  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/posts/comments/${commentId}`);
    return response.data;
  },
};
