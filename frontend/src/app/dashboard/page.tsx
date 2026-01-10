'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { profileApi } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth';
import { USER_TYPE_LABELS } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth, refreshToken } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated, router]);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getMyProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const userProfile = profile?.userProfile;
  const stats = profile?._count;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-purple-600 font-medium">Inicio</Link>
            <Link href="/network" className="text-gray-600 hover:text-purple-600">Red</Link>
            <Link href="/jobs" className="text-gray-600 hover:text-purple-600">Empleos</Link>
            <Link href="/messages" className="text-gray-600 hover:text-purple-600">Mensajes</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                {userProfile?.avatar ? (
                  <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-purple-600">
                    {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-gray-700">
                {userProfile?.firstName}
              </span>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-purple-500 to-blue-500" />
              <div className="px-4 pb-4">
                <div className="-mt-10 mb-3">
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center overflow-hidden">
                    {userProfile?.avatar ? (
                      <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-medium text-purple-600">
                        {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                      </span>
                    )}
                  </div>
                </div>
                <Link href="/profile" className="hover:underline">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600">{userProfile?.headline || 'Sin título'}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                  {USER_TYPE_LABELS[profile?.userType as keyof typeof USER_TYPE_LABELS] || profile?.userType}
                </span>

                <div className="flex justify-around mt-4 pt-4 border-t text-center">
                  <div>
                    <p className="text-lg font-semibold text-purple-600">
                      {(stats?.sentConnections || 0) + (stats?.receivedConnections || 0)}
                    </p>
                    <p className="text-xs text-gray-500">Conexiones</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-purple-600">{stats?.posts || 0}</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-purple-600">{stats?.followers || 0}</p>
                    <p className="text-xs text-gray-500">Seguidores</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mt-4">
              <h3 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Link href="/profile/edit" className="block">
                  <Button variant="outline" className="w-full justify-start">📝 Completar Perfil</Button>
                </Link>
                <Link href="/jobs" className="block">
                  <Button variant="outline" className="w-full justify-start">🔍 Buscar Empleos</Button>
                </Link>
                <Link href="/network" className="block">
                  <Button variant="outline" className="w-full justify-start">👥 Ampliar Red</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                  {userProfile?.avatar ? (
                    <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium text-purple-600">
                      {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                    </span>
                  )}
                </div>
                <button className="flex-1 text-left px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
                  ¿Qué quieres compartir?
                </button>
              </div>
              <div className="flex justify-around mt-4 pt-3 border-t">
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <span>📷</span> Foto
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <span>📹</span> Video
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <span>📝</span> Artículo
                </button>
              </div>
            </div>

            {/* Empty Feed State */}
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu feed está vacío</h3>
              <p className="text-gray-600 mb-4">
                Conecta con otros profesionales y empieza a ver contenido relevante
              </p>
              <Link href="/network">
                <Button>Explorar Red</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
