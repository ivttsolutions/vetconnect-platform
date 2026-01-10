'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { jobsApi } from '@/lib/jobs';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Application {
  id: string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    jobType: string;
    city?: string;
    remote: boolean;
    company: {
      companyProfile?: {
        companyName: string;
        logo?: string;
      };
    };
  };
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  REVIEWED: { label: 'Revisada', color: 'bg-blue-100 text-blue-700' },
  SHORTLISTED: { label: 'Preseleccionado', color: 'bg-purple-100 text-purple-700' },
  INTERVIEW: { label: 'Entrevista', color: 'bg-indigo-100 text-indigo-700' },
  OFFERED: { label: 'Oferta', color: 'bg-green-100 text-green-700' },
  HIRED: { label: 'Contratado', color: 'bg-green-200 text-green-800' },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-700' },
  WITHDRAWN: { label: 'Retirada', color: 'bg-gray-100 text-gray-700' },
};

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Medio tiempo',
  CONTRACT: 'Contrato',
  TEMPORARY: 'Temporal',
  INTERNSHIP: 'Prácticas',
};

export default function MyApplicationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadApplications();
  }, [isAuthenticated]);

  const loadApplications = async () => {
    try {
      const response = await jobsApi.getMyApplications();
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'active') {
      return !['REJECTED', 'WITHDRAWN', 'HIRED'].includes(app.status);
    }
    if (filter === 'closed') {
      return ['REJECTED', 'WITHDRAWN', 'HIRED'].includes(app.status);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/jobs')} className="text-gray-600 hover:text-purple-600">
            ← Volver a empleos
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis aplicaciones</h1>
          <p className="text-sm text-gray-500">Seguimiento de tus candidaturas</p>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 mb-6 bg-white rounded-xl shadow-sm p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todas ({applications.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'active' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'closed' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Finalizadas
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No tienes aplicaciones' : 'No hay aplicaciones en esta categoría'}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' && 'Explora las ofertas de empleo y aplica a las que te interesen.'}
            </p>
            {filter === 'all' && (
              <Button onClick={() => router.push('/jobs')} className="bg-purple-600 hover:bg-purple-700">
                Ver empleos
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                      {application.job.company?.companyProfile?.companyName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3
                        onClick={() => router.push(`/jobs/${application.job.id}`)}
                        className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer"
                      >
                        {application.job.title}
                      </h3>
                      <p className="text-gray-600">
                        {application.job.company?.companyProfile?.companyName || 'Empresa'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-500">
                          📍 {application.job.city || 'Ubicación no especificada'}
                        </span>
                        {application.job.remote && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Remoto
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {jobTypeLabels[application.job.jobType] || application.job.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      statusLabels[application.status]?.color || 'bg-gray-100 text-gray-700'
                    }`}>
                      {statusLabels[application.status]?.label || application.status}
                    </span>
                    <p className="text-sm text-gray-400 mt-2">
                      Aplicado {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Tu carta de presentación:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{application.coverLetter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
