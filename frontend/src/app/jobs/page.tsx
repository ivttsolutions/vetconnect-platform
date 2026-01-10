'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { jobsApi } from '@/lib/jobs';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Job {
  id: string;
  title: string;
  description: string;
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
  createdAt: string;
  company: {
    id: string;
    companyProfile?: {
      companyName: string;
      logo?: string;
      city?: string;
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

export default function JobsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'remote'>('all');
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    loadJobs();
  }, [filter, jobType]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsApi.getJobs({
        remote: filter === 'remote' ? true : undefined,
        jobType: jobType || undefined,
        search: search || undefined,
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const formatSalary = (job: Job) => {
    if (!job.showSalary || (!job.salaryMin && !job.salaryMax)) return null;
    const currency = job.salaryCurrency || 'EUR';
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${currency}`;
    }
    if (job.salaryMin) return `Desde ${job.salaryMin.toLocaleString()} ${currency}`;
    if (job.salaryMax) return `Hasta ${job.salaryMax.toLocaleString()} ${currency}`;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">💼 Empleos</h1>
            <p className="text-sm text-gray-500">Encuentra oportunidades en el sector veterinario</p>
          </div>
          {isAuthenticated && (
            <div className="flex gap-2">
              <Button onClick={() => router.push('/jobs/my-applications')} variant="outline">
                Mis aplicaciones
              </Button>
              <Button onClick={() => router.push('/jobs/create')} className="bg-purple-600 hover:bg-purple-700">
                + Publicar empleo
              </Button>
            </div>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, descripción o habilidades..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos los tipos</option>
              <option value="FULL_TIME">Tiempo completo</option>
              <option value="PART_TIME">Medio tiempo</option>
              <option value="CONTRACT">Contrato</option>
              <option value="INTERNSHIP">Prácticas</option>
            </select>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Buscar
            </Button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex space-x-1 mb-6 bg-white rounded-xl shadow-sm p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('remote')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'remote' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏠 Remoto
          </button>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay empleos disponibles</h3>
            <p className="text-gray-600">Vuelve a intentar con otros filtros o más tarde.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xl">
                      {job.company?.companyProfile?.companyName?.charAt(0) || '?'}
                    </div>

                    {/* Job Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">
                        {job.company?.companyProfile?.companyName || 'Empresa'}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 mt-2">
                        <span className="text-sm text-gray-500">
                          📍 {job.city || job.location}
                        </span>
                        {job.remote && (
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            🏠 Remoto
                          </span>
                        )}
                        <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          {jobTypeLabels[job.jobType] || job.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Salary & Time */}
                  <div className="text-right">
                    {formatSalary(job) && (
                      <p className="text-green-600 font-semibold">{formatSalary(job)}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="text-xs text-gray-400">+{job.skills.length - 5} más</span>
                    )}
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
