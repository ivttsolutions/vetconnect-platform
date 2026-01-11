'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { postsApi } from '@/lib/posts';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

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
  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function FeedPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadFeed();
  }, [isAuthenticated, isHydrated, router]);

  const loadFeed = async () => {
    try {
      const response = await postsApi.getFeed();
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    setPosting(true);
    try {
      const response = await postsApi.createPost({ content: newPostContent });
      setPosts([response.data, ...posts]);
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await postsApi.likePost(postId);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: response.data.liked,
            _count: {
              ...post._count,
              likes: response.data.liked ? post._count.likes + 1 : post._count.likes - 1,
            },
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const getAuthorName = (post: Post) => {
    if (post.author.companyProfile) {
      return post.author.companyProfile.companyName;
    }
    if (post.author.userProfile) {
      return `${post.author.userProfile.firstName} ${post.author.userProfile.lastName}`;
    }
    return 'Usuario';
  };

  const getAuthorAvatar = (post: Post) => {
    if (post.author.companyProfile?.logo) {
      return post.author.companyProfile.logo;
    }
    if (post.author.userProfile?.avatar) {
      return post.author.userProfile.avatar;
    }
    return null;
  };

  const getAuthorHeadline = (post: Post) => {
    if (post.author.companyProfile) {
      return 'Empresa';
    }
    return post.author.userProfile?.headline || '';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
              {user?.firstName?.[0] || user?.companyName?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="¿Qué quieres compartir?"
                className="w-full border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-purple-600 p-2 rounded-lg hover:bg-gray-100">
                    📷 Foto
                  </button>
                  <button className="text-gray-500 hover:text-purple-600 p-2 rounded-lg hover:bg-gray-100">
                    📎 Archivo
                  </button>
                </div>
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || posting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {posting ? 'Publicando...' : 'Publicar'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay publicaciones aún</h3>
            <p className="text-gray-600">¡Sé el primero en compartir algo con la comunidad!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Post Header */}
                <div className="p-4 flex items-start space-x-3">
                  <div 
                    onClick={() => router.push(`/profile/${post.author.id}`)}
                    className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    {getAuthorAvatar(post) ? (
                      <img 
                        src={getAuthorAvatar(post)!} 
                        alt={getAuthorName(post)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-purple-600 font-bold text-lg">
                        {getAuthorName(post)[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 
                      onClick={() => router.push(`/profile/${post.author.id}`)}
                      className="font-semibold text-gray-900 cursor-pointer hover:underline"
                    >
                      {getAuthorName(post)}
                    </h4>
                    <p className="text-sm text-gray-500">{getAuthorHeadline(post)}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="rounded-lg w-full h-48 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Stats */}
                <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>{post._count.likes} me gusta</span>
                  <span>{post._count.comments} comentarios</span>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-around">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      post.isLiked 
                        ? 'text-purple-600 bg-purple-50' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{post.isLiked ? '💜' : '🤍'}</span>
                    <span>Me gusta</span>
                  </button>
                  <button 
                    onClick={() => router.push(`/posts/${post.id}`)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <span>💬</span>
                    <span>Comentar</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                    <span>🔗</span>
                    <span>Compartir</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
