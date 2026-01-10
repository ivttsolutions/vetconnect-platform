'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth, refreshToken } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user.profile?.firstName} {user.profile?.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to VetConnect!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
              <div className="space-y-2">
                <p><span className="opacity-75">Name:</span> {user.profile?.firstName} {user.profile?.lastName}</p>
                <p><span className="opacity-75">Email:</span> {user.email}</p>
                <p><span className="opacity-75">Type:</span> {user.userType}</p>
                <p><span className="opacity-75">Status:</span> {user.status}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  📝 Complete Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🔍 Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  👥 Find Connections
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Connections</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-gray-600">Messages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
