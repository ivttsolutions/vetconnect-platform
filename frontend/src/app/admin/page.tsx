'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { adminApi } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Tab = 'stats' | 'users' | 'posts' | 'jobs' | 'events';

interface Stats {
  users: { total: number; active: number };
  posts: { total: number };
  jobs: { total: number; active: number };
  events: { total: number; upcoming: number };
  connections: { total: number };
}

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadStats();
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    else if (activeTab === 'posts') loadPosts();
    else if (activeTab === 'jobs') loadJobs();
    else if (activeTab === 'events') loadEvents();
  }, [activeTab, pagination.page]);

  const loadStats = async () => {
    try {
      const response = await adminApi.getStats();
      setStats(response.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('No tienes permisos de administrador');
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers({ page: pagination.page, search: searchTerm });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await adminApi.getPosts({ page: pagination.page, search: searchTerm });
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await adminApi.getJobs({ page: pagination.page });
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await adminApi.getEvents({ page: pagination.page });
      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleUserStatusChange = async (userId: string, status: string) => {
    if (!confirm(`¿Cambiar estado a ${status}?`)) return;
    try {
      await adminApi.updateUserStatus(userId, status);
      loadUsers();
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      await adminApi.deleteUser(userId);
      loadUsers();
    } catch (error) {
      alert('Error al eliminar usuario');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Eliminar este post?')) return;
    try {
      await adminApi.deletePost(postId);
      loadPosts();
    } catch (error) {
      alert('Error al eliminar post');
    }
  };

  const handleJobStatusChange = async (jobId: string, status: string) => {
    try {
      await adminApi.updateJobStatus(jobId, status);
      loadJobs();
    } catch (error) {
      alert('Error al actualizar empleo');
    }
  };

  const handleEventStatusChange = async (eventId: string, status: string) => {
    try {
      await adminApi.updateEventStatus(eventId, status);
      loadEvents();
    } catch (error) {
      alert('Error al actualizar evento');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'jobs', label: 'Empleos', icon: '💼' },
    { id: 'events', label: 'Eventos', icon: '📅' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-xl font-bold">Panel de Administración</h1>
              <p className="text-purple-200 text-sm">VetConnect</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-white text-white hover:bg-purple-600"
          >
            ← Volver al Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setPagination({ ...pagination, page: 1 }); }}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-purple-600">{stats.users.total}</div>
              <div className="text-gray-600">Usuarios totales</div>
              <div className="text-sm text-green-600">{stats.users.active} activos</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.posts.total}</div>
              <div className="text-gray-600">Publicaciones</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-green-600">{stats.jobs.total}</div>
              <div className="text-gray-600">Empleos</div>
              <div className="text-sm text-green-600">{stats.jobs.active} activos</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-orange-600">{stats.events.total}</div>
              <div className="text-gray-600">Eventos</div>
              <div className="text-sm text-orange-600">{stats.events.upcoming} próximos</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-pink-600">{stats.connections.total}</div>
              <div className="text-gray-600">Conexiones</div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                className="border rounded-lg px-4 py-2 w-64"
              />
              <span className="text-gray-500">{pagination.total} usuarios</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Usuario</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tipo</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                          {u.name?.[0] || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.userType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        u.status === 'INACTIVE' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {format(new Date(u.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/profile/${u.id}`)}
                          className="text-purple-600 hover:underline text-sm"
                        >
                          Ver
                        </button>
                        {u.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleUserStatusChange(u.id, 'SUSPENDED')}
                            className="text-orange-600 hover:underline text-sm"
                          >
                            Suspender
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserStatusChange(u.id, 'ACTIVE')}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Activar
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Página {pagination.page} de {pagination.pages}
              </span>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  variant="outline"
                  size="sm"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  variant="outline"
                  size="sm"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <span className="text-gray-500">{pagination.total} posts</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Contenido</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Autor</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Engagement</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{p.content}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.authorName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      ❤️ {p.likesCount} · 💬 {p.commentsCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {format(new Date(p.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeletePost(p.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <span className="text-gray-500">{pagination.total} empleos</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Título</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Empresa</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Aplicaciones</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{j.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{j.company}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        j.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{j.applicationsCount}</td>
                    <td className="px-4 py-3">
                      <select
                        value={j.status}
                        onChange={(e) => handleJobStatusChange(j.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="ACTIVE">Activo</option>
                        <option value="CLOSED">Cerrado</option>
                        <option value="DRAFT">Borrador</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <span className="text-gray-500">{pagination.total} eventos</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Título</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Organizador</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Inscritos</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{e.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{e.organizer}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {format(new Date(e.startDate), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{e.registrationsCount}</td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => handleEventStatusChange(e.id, ev.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="PUBLISHED">Publicado</option>
                        <option value="DRAFT">Borrador</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
