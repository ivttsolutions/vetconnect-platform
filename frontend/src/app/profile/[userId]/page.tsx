'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { connectionsApi } from '@/lib/connections';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserProfile {
  id: string;
  email: string;
  userType: string;
  userProfile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    coverPhoto?: string;
    headline?: string;
    bio?: string;
    city?: string;
    country?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    specialties?: string[];
    languages?: string[];
    education?: any[];
    experience?: any[];
    certifications?: any[];
  };
  companyProfile?: {
    companyName: string;
    logo?: string;
    coverPhoto?: string;
    description?: string;
    companyType?: string;
    website?: string;
    phone?: string;
    city?: string;
    country?: string;
    employeeCount?: string;
    foundedYear?: number;
    services?: string[];
    socialMedia?: any;
  };
  _count?: {
    posts: number;
    sentConnections: number;
    receivedConnections: number;
  };
}

interface ConnectionStatus {
  isConnected: boolean;
  isPending: boolean;
  isReceived: boolean;
  connectionId?: string;
}

const userTypeLabels: Record<string, string> = {
  VETERINARIAN: 'Veterinario/a',
  VET_TECHNICIAN: 'Técnico Veterinario',
  VET_ASSISTANT: 'Auxiliar Veterinario',
  VET_STUDENT: 'Estudiante de Veterinaria',
  RESEARCHER: 'Investigador/a',
  PROFESSOR: 'Profesor/a',
  OTHER: 'Otro profesional',
};

const companyTypeLabels: Record<string, string> = {
  VET_CLINIC: 'Clínica Veterinaria',
  VET_HOSPITAL: 'Hospital Veterinario',
  PET_SHOP: 'Tienda de Mascotas',
  LABORATORY: 'Laboratorio',
  PHARMACEUTICAL: 'Farmacéutica',
  DISTRIBUTOR: 'Distribuidor',
  UNIVERSITY: 'Universidad',
  RESEARCH_CENTER: 'Centro de Investigación',
  ASSOCIATION: 'Asociación',
  SHELTER: 'Refugio/Protectora',
  GROOMING: 'Peluquería Canina',
  TRAINING: 'Adiestramiento',
  INSURANCE: 'Seguros',
  NUTRITION: 'Nutrición Animal',
  OTHER: 'Otra empresa',
};

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { isAuthenticated, user: currentUser } = useAuthStore();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isPending: false,
    isReceived: false,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      // Si es mi propio perfil, redirigir
      if (currentUser?.id === userId) {
        router.push('/profile');
        return;
      }
      loadProfile();
    }
  }, [userId, currentUser]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setProfile(response.data.data);
      
      // Verificar estado de conexión si está autenticado
      if (isAuthenticated) {
        checkConnectionStatus();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await connectionsApi.getConnectionStatus(userId);
      setConnectionStatus(response.data);
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnect = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setActionLoading(true);
    try {
      await connectionsApi.sendRequest(userId);
      setConnectionStatus({ ...connectionStatus, isPending: true });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al enviar solicitud');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!connectionStatus.connectionId) return;
    
    setActionLoading(true);
    try {
      await connectionsApi.acceptRequest(connectionStatus.connectionId);
      setConnectionStatus({ ...connectionStatus, isConnected: true, isReceived: false });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al aceptar solicitud');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = () => {
    router.push(`/messages?userId=${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900">Usuario no encontrado</h2>
          <Button onClick={() => router.push('/network')} className="mt-4">
            Volver a la red
          </Button>
        </div>
      </div>
    );
  }

  const isCompany = !!profile.companyProfile;
  const displayName = isCompany 
    ? profile.companyProfile?.companyName 
    : `${profile.userProfile?.firstName} ${profile.userProfile?.lastName}`;
  const headline = isCompany 
    ? companyTypeLabels[profile.companyProfile?.companyType || ''] || profile.companyProfile?.companyType
    : profile.userProfile?.headline || userTypeLabels[profile.userType] || profile.userType;
  const avatar = isCompany ? profile.companyProfile?.logo : profile.userProfile?.avatar;
  const coverPhoto = isCompany ? profile.companyProfile?.coverPhoto : profile.userProfile?.coverPhoto;
  const bio = isCompany ? profile.companyProfile?.description : profile.userProfile?.bio;
  const location = isCompany 
    ? [profile.companyProfile?.city, profile.companyProfile?.country].filter(Boolean).join(', ')
    : [profile.userProfile?.city, profile.userProfile?.country].filter(Boolean).join(', ');
  const website = isCompany ? profile.companyProfile?.website : profile.userProfile?.website;

  const connectionsCount = (profile._count?.sentConnections || 0) + (profile._count?.receivedConnections || 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-purple-600">
            ← Volver
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Cover & Avatar */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-700 relative">
            {coverPhoto && (
              <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl text-purple-600 font-bold">
                    {displayName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Name & Actions */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-gray-600">{headline}</p>
                {location && (
                  <p className="text-sm text-gray-500 mt-1">📍 {location}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{connectionsCount} conexiones</span>
                  <span>{profile._count?.posts || 0} publicaciones</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {connectionStatus.isConnected ? (
                  <>
                    <Button onClick={handleMessage} className="bg-purple-600 hover:bg-purple-700">
                      ✉️ Mensaje
                    </Button>
                    <Button variant="outline" disabled>
                      ✓ Conectados
                    </Button>
                  </>
                ) : connectionStatus.isPending ? (
                  <Button variant="outline" disabled>
                    ⏳ Solicitud enviada
                  </Button>
                ) : connectionStatus.isReceived ? (
                  <Button 
                    onClick={handleAccept} 
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading ? '...' : '✓ Aceptar solicitud'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleConnect} 
                    disabled={actionLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {actionLoading ? '...' : '+ Conectar'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            {bio && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {isCompany ? 'Sobre la empresa' : 'Acerca de'}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{bio}</p>
              </div>
            )}

            {/* Experience (only for individuals) */}
            {!isCompany && profile.userProfile?.experience && profile.userProfile.experience.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiencia</h2>
                <div className="space-y-4">
                  {profile.userProfile.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-purple-200 pl-4">
                      <h3 className="font-medium text-gray-900">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education (only for individuals) */}
            {!isCompany && profile.userProfile?.education && profile.userProfile.education.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Formación</h2>
                <div className="space-y-4">
                  {profile.userProfile.education.map((edu: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-purple-200 pl-4">
                      <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services (only for companies) */}
            {isCompany && profile.companyProfile?.services && profile.companyProfile.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicios</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.companyProfile.services.map((service: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información</h2>
              <div className="space-y-3">
                {website && (
                  <div>
                    <p className="text-sm text-gray-500">Sitio web</p>
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      {website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {!isCompany && profile.userProfile?.linkedin && (
                  <div>
                    <p className="text-sm text-gray-500">LinkedIn</p>
                    <a href={profile.userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      Ver perfil
                    </a>
                  </div>
                )}
                {isCompany && profile.companyProfile?.foundedYear && (
                  <div>
                    <p className="text-sm text-gray-500">Fundada en</p>
                    <p className="text-gray-900">{profile.companyProfile.foundedYear}</p>
                  </div>
                )}
                {isCompany && profile.companyProfile?.employeeCount && (
                  <div>
                    <p className="text-sm text-gray-500">Empleados</p>
                    <p className="text-gray-900">{profile.companyProfile.employeeCount}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Specialties / Skills */}
            {!isCompany && profile.userProfile?.specialties && profile.userProfile.specialties.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Especialidades</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.userProfile.specialties.map((spec: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {!isCompany && profile.userProfile?.languages && profile.userProfile.languages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Idiomas</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.userProfile.languages.map((lang: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {lang}
                    </span>
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
