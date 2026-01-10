'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { postsApi } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    userProfile?: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  _count: {
    likes: number;
    replies: number;
  };
}

interface Post {
  id: string;
  content: string;
  images: string[];
  createdAt: string;
  isLiked: boolean;
  author: {
    id: string;
    userProfile?: {
      firstName: string;
      lastName: string;
      avatar?: string;
      headline?: string;
    };
    companyProfile?: {
      companyName: string;
      logo?: string;
    };
  };
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const { user, isAuthenticated } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      const response = await postsApi.getPost(postId);
      setPost(response.data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !post) return;
    
    try {
      const response = await postsApi.likePost(post.id);
      setPost({
        ...post,
        isLiked: response.data.liked,
        _count: {
          ...post._count,
          likes: response.data.liked ? post._count.likes + 1 : post._count.likes - 1,
        },
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !isAuthenticated || !post) return;
    
    setCommenting(true);
    try {
      const response = await postsApi.addComment(post.id, newComment);
      setPost({
        ...post,
        comments: [response.data, ...post.comments],
        _count: {
          ...post._count,
          comments: post._count.comments + 1,
        },
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  const getAuthorName = (author: Post['author']) => {
    if (author.companyProfile) {
      return author.companyProfile.companyName;
    }
    if (author.userProfile) {
      return `${author.userProfile.firstName} ${author.userProfile.lastName}`;
    }
    return 'Usuario';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Publicación no encontrada</h2>
          <Button onClick={() => router.push('/feed')} className="mt-4">
            Volver al Feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
          <span className="font-semibold text-gray-900">Publicación</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Post */}
        <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Post Header */}
          <div className="p-4 flex items-start space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">
                {getAuthorName(post.author)[0]}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{getAuthorName(post.author)}</h4>
              <p className="text-sm text-gray-500">{post.author.userProfile?.headline || ''}</p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-4">
            <p className="text-gray-800 whitespace-pre-wrap text-lg">{post.content}</p>
          </div>

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="px-4 pb-4">
              {post.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="rounded-lg w-full object-cover"
                />
              ))}
            </div>
          )}

          {/* Post Stats */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>{post._count.likes} me gusta</span>
            <span>{post._count.comments} comentarios</span>
          </div>

          {/* Post Actions */}
          <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-around">
            <button 
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                post.isLiked 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{post.isLiked ? '💜' : '🤍'}</span>
              <span>Me gusta</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <span>🔗</span>
              <span>Compartir</span>
            </button>
          </div>
        </article>

        {/* Add Comment */}
        {isAuthenticated && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">
                  {user?.profile?.firstName?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    onClick={handleComment}
                    disabled={!newComment.trim() || commenting}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {commenting ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Comentarios ({post._count.comments})</h3>
          
          {post.comments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-500">No hay comentarios aún. ¡Sé el primero!</p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">
                      {comment.author.userProfile?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">
                        {comment.author.userProfile 
                          ? `${comment.author.userProfile.firstName} ${comment.author.userProfile.lastName}`
                          : 'Usuario'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                      </span>
                    </div>
                    <p className="text-gray-800 mt-1">{comment.content}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <button className="hover:text-purple-600">
                        {comment._count.likes} me gusta
                      </button>
                      <button className="hover:text-purple-600">
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
