'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { jobsApi } from '@/lib/jobs';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits?: string;
  jobType: string;
  location: string;
  city?: string;
  country?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  showSalary: boolean;
  experienceYears?: number;
  skills: string[];
  specialization: string[];
  educationLevel?: string;
  applicationDeadline?: string;
  createdAt: string;
  viewsCount: number;
  hasApplied: boolean;
  isSaved: boolean;
  company: {
    id: string;
    companyProfile?: {
      companyName: string;
      logo?: string;
      description?: string;
      city?: string;
      country?: string;
    };
  };
  _count?: {
    applications: number;
  };
}

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Medio tiempo',
  CONTRACT: 'Contrato',
  TEMPORARY: 'Temporal',
  INTERNSHIP: 'Prácticas',
  VOLUNTEER: 'Voluntariado',
};

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const { isAuthenticated } = useAuthStore();
  
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = async () => {
    try {
      const response = await jobsApi.getJob(jobId);
      setJob(response.data);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setApplying(true);
    try {
      await jobsApi.applyToJob(jobId, { coverLetter: coverLetter || undefined });
      setJob(job ? { ...job, hasApplied: true } : null);
      setShowApplyModal(false);
      alert('¡Aplicación enviada con éxito!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al aplicar');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const response = await jobsApi.saveJob(jobId);
      setJob(job ? { ...job, isSaved: response.data.saved } : null);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const formatSalary = () => {
    if (!job?.showSalary || (!job.salaryMin && !job.salaryMax)) return null;
    const currency = job.salaryCurrency || 'EUR';
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${currency}`;
    }
    if (job.salaryMin) return `Desde ${job.salaryMin.toLocaleString()} ${currency}`;
    if (job.salaryMax) return `Hasta ${job.salaryMax.toLocaleString()} ${currency}`;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Empleo no encontrado</h2>
          <Button onClick={() => router.push('/jobs')} className="mt-4">
            Volver a empleos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/jobs')} className="flex items-center text-gray-600 hover:text-purple-600">
            ← Volver
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-2xl">
                  {job.company?.companyProfile?.companyName?.charAt(0) || '?'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg text-gray-600">{job.company?.companyProfile?.companyName}</p>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className="text-gray-500">📍 {job.city || job.location}</span>
                    {job.remote && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm">
                        🏠 Remoto
                      </span>
                    )}
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm">
                      {jobTypeLabels[job.jobType] || job.jobType}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {formatSalary() && (
                  <p className="text-xl font-bold text-green-600">{formatSalary()}</p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  Publicado {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: es })}
                </p>
                <p className="text-sm text-gray-400">
                  {job.viewsCount} visualizaciones
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 mt-6">
              {job.hasApplied ? (
                <Button disabled className="bg-green-600">
                  ✓ Ya aplicaste
                </Button>
              ) : (
                <Button onClick={() => setShowApplyModal(true)} className="bg-purple-600 hover:bg-purple-700">
                  Aplicar ahora
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSave}
              >
                {job.isSaved ? '❤️ Guardado' : '🤍 Guardar'}
              </Button>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.requirements}</p>
            </div>

            {/* Responsibilities */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsabilidades</h2>
              <p className="text-gray-600 whitespace-pre-line">{job.responsibilities}</p>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Beneficios</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.benefits}</p>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Habilidades requeridas</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              {job.experienceYears && (
                <div>
                  <span className="text-gray-500">Experiencia:</span>
                  <span className="ml-2 text-gray-900">{job.experienceYears} años</span>
                </div>
              )}
              {job.educationLevel && (
                <div>
                  <span className="text-gray-500">Educación:</span>
                  <span className="ml-2 text-gray-900">{job.educationLevel}</span>
                </div>
              )}
              {job.applicationDeadline && (
                <div>
                  <span className="text-gray-500">Fecha límite:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(job.applicationDeadline).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre la empresa</h2>
            <p className="text-gray-600">
              {job.company?.companyProfile?.description || 'Sin descripción disponible.'}
            </p>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aplicar a {job.title}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carta de presentación (opcional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                placeholder="Cuéntanos por qué eres el candidato ideal..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowApplyModal(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleApply}
                disabled={applying}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {applying ? 'Enviando...' : 'Enviar aplicación'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
