'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchApi } from '@/lib/search';
import { Header } from '@/components/layout';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SearchResults {
  users: Array<{
    id: string;
    type: string;
    name: string;
    headline?: string;
    avatar?: string;
    userType?: string;
    companyType?: string;
  }>;
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    city?: string;
    remote: boolean;
    jobType: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    type: string;
    mode: string;
    startDate: string;
    city?: string;
    organizer: string;
  }>;
  posts: Array<{
    id: string;
    content: string;
    author: string;
    createdAt: string;
  }>;
}

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Medio tiempo',
  CONTRACT: 'Contrato',
  INTERNSHIP: 'Prácticas',
};

const eventModeLabels: Record<string, string> = {
  IN_PERSON: 'Presencial',
  ONLINE: 'Online',
  HYBRID: 'Híbrido',
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'jobs' | 'events' | 'posts'>('all');

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) return;

    setLoading(true);
    try {
      const response = await searchApi.searchAll(searchQuery, 15);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  const totalResults = results
    ? results.users.length + results.jobs.length + results.events.length + results.posts.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Box */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar personas, empresas, empleos, eventos..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              🔍 Buscar
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : results ? (
          <>
            {/* Results Summary */}
            <div className="mb-4 text-gray-600">
              {totalResults} resultados para "{initialQuery}"
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-white rounded-xl shadow-sm p-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'all' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Todos ({totalResults})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                👤 Personas ({results.users.length})
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'jobs' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                💼 Empleos ({results.jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'events' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📅 Eventos ({results.events.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'posts' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📝 Posts ({results.posts.length})
              </button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Users */}
              {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                <div>
                  {activeTab === 'all' && <h2 className="text-lg font-semibold text-gray-900 mb-3">👤 Personas</h2>}
                  <div className="space-y-3">
                    {results.users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => router.push(`/profile/${user.id}`)}
                        className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            {user.headline && (
                              <p className="text-sm text-gray-600">{user.headline}</p>
                            )}
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              {user.type === 'COMPANY' ? 'Empresa' : 'Profesional'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                <div>
                  {activeTab === 'all' && <h2 className="text-lg font-semibold text-gray-900 mb-3 mt-6">💼 Empleos</h2>}
                  <div className="space-y-3">
                    {results.jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => router.push(`/jobs/${job.id}`)}
                        className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {job.city && <span className="text-xs text-gray-500">📍 {job.city}</span>}
                          {job.remote && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Remoto
                            </span>
                          )}
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {jobTypeLabels[job.jobType] || job.jobType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                <div>
                  {activeTab === 'all' && <h2 className="text-lg font-semibold text-gray-900 mb-3 mt-6">📅 Eventos</h2>}
                  <div className="space-y-3">
                    {results.events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-600">{event.organizer}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                🕐 {format(new Date(event.startDate), "d MMM yyyy", { locale: es })}
                              </span>
                              {event.city && <span className="text-xs text-gray-500">📍 {event.city}</span>}
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                event.mode === 'ONLINE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {eventModeLabels[event.mode] || event.mode}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <div>
                  {activeTab === 'all' && <h2 className="text-lg font-semibold text-gray-900 mb-3 mt-6">📝 Publicaciones</h2>}
                  <div className="space-y-3">
                    {results.posts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => router.push(`/posts/${post.id}`)}
                        className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <p className="text-sm text-gray-600 mb-2">{post.author}</p>
                        <p className="text-gray-900">{post.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {totalResults === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-600">Intenta con otros términos de búsqueda.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Busca en VetConnect</h3>
            <p className="text-gray-600">
              Encuentra profesionales, empresas, empleos, eventos y más.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
