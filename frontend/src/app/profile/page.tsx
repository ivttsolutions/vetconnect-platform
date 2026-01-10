'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { profileApi } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import { USER_TYPE_LABELS } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getMyProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </Link>
          <Link href="/profile/edit">
            <Button variant="outline">Editar Perfil</Button>
          </Link>
        </div>
      </header>

      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 relative">
        {userProfile?.coverPhoto && (
          <img
            src={userProfile.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-purple-100 flex items-center justify-center">
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">
                  {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {userProfile?.firstName} {userProfile?.lastName}
              </h1>
              <p className="text-gray-600">{userProfile?.headline || 'Sin título profesional'}</p>
              <p className="text-sm text-gray-500">
                {userProfile?.city && userProfile?.country
                  ? `${userProfile.city}, ${userProfile.country}`
                  : 'Ubicación no especificada'}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {USER_TYPE_LABELS[profile?.userType as keyof typeof USER_TYPE_LABELS] || profile?.userType}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {(stats?.sentConnections || 0) + (stats?.receivedConnections || 0)}
              </p>
              <p className="text-sm text-gray-600">Conexiones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats?.posts || 0}</p>
              <p className="text-sm text-gray-600">Publicaciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats?.followers || 0}</p>
              <p className="text-sm text-gray-600">Seguidores</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {userProfile?.bio && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Acerca de</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{userProfile.bio}</p>
          </div>
        )}

        {/* Experience */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Experiencia</h2>
            <Link href="/profile/edit#experience">
              <Button variant="ghost" size="sm">+ Añadir</Button>
            </Link>
          </div>
          {userProfile?.experiences?.length > 0 ? (
            <div className="space-y-4">
              {userProfile.experiences.map((exp: any) => (
                <div key={exp.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💼</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{exp.title}</h3>
                    <p className="text-gray-600">{exp.companyName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                      {' - '}
                      {exp.current ? 'Actualidad' : new Date(exp.endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                    </p>
                    {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay experiencias añadidas</p>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Educación</h2>
            <Link href="/profile/edit#education">
              <Button variant="ghost" size="sm">+ Añadir</Button>
            </Link>
          </div>
          {userProfile?.educations?.length > 0 ? (
            <div className="space-y-4">
              {userProfile.educations.map((edu: any) => (
                <div key={edu.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(edu.startDate).getFullYear()}
                      {' - '}
                      {edu.current ? 'Actualidad' : new Date(edu.endDate).getFullYear()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay educación añadida</p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Habilidades</h2>
            <Link href="/profile/edit#skills">
              <Button variant="ghost" size="sm">+ Añadir</Button>
            </Link>
          </div>
          {userProfile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay habilidades añadidas</p>
          )}
        </div>
      </div>
    </div>
  );
}
