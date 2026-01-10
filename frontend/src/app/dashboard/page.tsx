'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { dashboardApi } from '@/lib/dashboard';
import { Header } from '@/components/layout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Stats {
  connections: number;
  pendingRequests: number;
  posts: number;
  totalLikes: number;
  totalComments: number;
  applications: number;
  savedJobs: number;
  eventsRegistered: number;
  unreadMessages: number;
  unreadNotifications: number;
}

interface Activity {
  notifications: Array<{
    id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
    actor: string | null;
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    sender: string;
  }>;
}

interface Recommendations {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    city?: string;
    remote: boolean;
  }>;
  events: Array<{
    id: string;
    title: string;
    startDate: string;
    mode: string;
    organizer: string;
  }>;
  connections: Array<{
    id: string;
    name: string;
    headline?: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadDashboard();
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      const [statsRes, activityRes, recsRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity(5),
        dashboardApi.getRecommendations(),
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
      setRecommendations(recsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Hola{user?.firstName ? `, ${user.firstName}` : ''}! 👋
          </h1>
          <p className="text-gray-600">Aquí está el resumen de tu actividad en VetConnect</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div 
            onClick={() => router.push('/network')}
            className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">{stats?.connections || 0}</p>
                <p className="text-sm text-gray-600">Conexiones</p>
              </div>
              <span className="text-3xl">🤝</span>
            </div>
            {stats?.pendingRequests ? (
              <p className="text-xs text-orange-600 mt-2">
                {stats.pendingRequests} solicitudes pendientes
              </p>
            ) : null}
          </div>

          <div 
            onClick={() => router.push('/feed')}
            className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{stats?.posts || 0}</p>
                <p className="text-sm text-gray-600">Publicaciones</p>
              </div>
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats?.totalLikes || 0} likes · {stats?.totalComments || 0} comentarios
            </p>
          </div>

          <div 
            onClick={() => router.push('/jobs/my-applications')}
            className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{stats?.applications || 0}</p>
                <p className="text-sm text-gray-600">Aplicaciones</p>
              </div>
              <span className="text-3xl">💼</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats?.savedJobs || 0} empleos guardados
            </p>
          </div>

          <div 
            onClick={() => router.push('/events/my-events')}
            className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600">{stats?.eventsRegistered || 0}</p>
                <p className="text-sm text-gray-600">Eventos</p>
              </div>
              <span className="text-3xl">📅</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(stats?.unreadMessages || stats?.unreadNotifications) ? (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {stats?.unreadMessages ? (
                  <span 
                    onClick={() => router.push('/messages')}
                    className="text-purple-700 cursor-pointer hover:underline"
                  >
                    ✉️ {stats.unreadMessages} mensaje{stats.unreadMessages > 1 ? 's' : ''} sin leer
                  </span>
                ) : null}
                {stats?.unreadNotifications ? (
                  <span 
                    onClick={() => router.push('/notifications')}
                    className="text-purple-700 cursor-pointer hover:underline"
                  >
                    🔔 {stats.unreadNotifications} notificación{stats.unreadNotifications > 1 ? 'es' : ''} nueva{stats.unreadNotifications > 1 ? 's' : ''}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="md:col-span-2 space-y-6">
            {/* Recent Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Actividad reciente</h2>
                <button 
                  onClick={() => router.push('/notifications')}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Ver todo
                </button>
              </div>
              {activity?.notifications && activity.notifications.length > 0 ? (
                <div className="space-y-3">
                  {activity.notifications.slice(0, 5).map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg ${notif.read ? 'bg-gray-50' : 'bg-purple-50'}`}>
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(notif.createdAt), "d MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => router.push('/feed')}
                  className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-2xl">📝</span>
                  <span className="text-sm font-medium text-purple-700">Crear publicación</span>
                </button>
                <button 
                  onClick={() => router.push('/jobs/create')}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-2xl">💼</span>
                  <span className="text-sm font-medium text-green-700">Publicar empleo</span>
                </button>
                <button 
                  onClick={() => router.push('/events/create')}
                  className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <span className="text-2xl">📅</span>
                  <span className="text-sm font-medium text-orange-700">Crear evento</span>
                </button>
                <button 
                  onClick={() => router.push('/search')}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-2xl">🔍</span>
                  <span className="text-sm font-medium text-blue-700">Buscar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Recommendations */}
          <div className="space-y-6">
            {/* Suggested Jobs */}
            {recommendations?.jobs && recommendations.jobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Empleos sugeridos</h2>
                  <button 
                    onClick={() => router.push('/jobs')}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Ver más
                  </button>
                </div>
                <div className="space-y-3">
                  {recommendations.jobs.map((job) => (
                    <div 
                      key={job.id}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                      <p className="text-xs text-gray-600">{job.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {job.city && <span className="text-xs text-gray-500">📍 {job.city}</span>}
                        {job.remote && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Remoto</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {recommendations?.events && recommendations.events.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Próximos eventos</h2>
                  <button 
                    onClick={() => router.push('/events')}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Ver más
                  </button>
                </div>
                <div className="space-y-3">
                  {recommendations.events.map((event) => (
                    <div 
                      key={event.id}
                      onClick={() => router.push(`/events/${event.id}`)}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.organizer}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {format(new Date(event.startDate), "d MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* People to Connect */}
            {recommendations?.connections && recommendations.connections.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Conectar con</h2>
                  <button 
                    onClick={() => router.push('/network')}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Ver más
                  </button>
                </div>
                <div className="space-y-3">
                  {recommendations.connections.map((person) => (
                    <div 
                      key={person.id}
                      onClick={() => router.push(`/profile/${person.id}`)}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{person.name}</p>
                        {person.headline && (
                          <p className="text-xs text-gray-600 line-clamp-1">{person.headline}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
