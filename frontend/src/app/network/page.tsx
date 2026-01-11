'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { connectionsApi } from '@/lib/connections';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  userProfile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    headline?: string;
  };
  companyProfile?: {
    companyName: string;
    logo?: string;
  };
  connectionStatus?: string;
  connectionId?: string;
}

interface Connection {
  id: string;
  connectedAt: string;
  user: User;
}

interface PendingRequest {
  id: string;
  message?: string;
  createdAt: string;
  sender: User;
}

export default function NetworkPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'search'>('connections');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isHydrated, router]);

  const loadData = async () => {
    try {
      const [connectionsRes, pendingRes, suggestionsRes] = await Promise.all([
        connectionsApi.getConnections(),
        connectionsApi.getPendingRequests(),
        connectionsApi.getSuggestions(),
      ]);
      setConnections(connectionsRes.data || []);
      setPendingRequests(pendingRes.data || []);
      setSuggestions(suggestionsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await connectionsApi.searchUsers(searchQuery);
      setSearchResults(response.data || []);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await connectionsApi.sendRequest(userId);
      setSuggestions(suggestions.filter(s => s.id !== userId));
      setSearchResults(searchResults.map(u => 
        u.id === userId ? { ...u, connectionStatus: 'PENDING' } : u
      ));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al enviar solicitud');
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      await connectionsApi.acceptRequest(connectionId);
      loadData();
    } catch (error) {
      console.error('Error accepting:', error);
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      await connectionsApi.rejectRequest(connectionId);
      setPendingRequests(pendingRequests.filter(r => r.id !== connectionId));
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const handleRemoveConnection = async (connectionId: string) => {
    if (!confirm('¿Eliminar esta conexión?')) return;
    
    try {
      await connectionsApi.removeConnection(connectionId);
      setConnections(connections.filter(c => c.id !== connectionId));
    } catch (error) {
      console.error('Error removing:', error);
    }
  };

  const getUserName = (user: User) => {
    if (user.companyProfile) return user.companyProfile.companyName;
    if (user.userProfile) return `${user.userProfile.firstName} ${user.userProfile.lastName}`;
    return user.email;
  };

  const getUserHeadline = (user: User) => {
    if (user.companyProfile) return 'Empresa';
    return user.userProfile?.headline || '';
  };

  const getUserAvatar = (user: User) => {
    return user.companyProfile?.logo || user.userProfile?.avatar || null;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar usuarios o empresas..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button onClick={handleSearch} disabled={searching} className="bg-purple-600 hover:bg-purple-700">
              {searching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-xl shadow-sm p-1">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'connections' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Mis Conexiones ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'pending' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Solicitudes ({pendingRequests.length})
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'search' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Resultados ({searchResults.length})
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : (
          <>
            {/* Connections Tab */}
            {activeTab === 'connections' && (
              <div className="space-y-4">
                {connections.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin conexiones aún</h3>
                    <p className="text-gray-600">Busca usuarios y envía solicitudes para construir tu red profesional.</p>
                  </div>
                ) : (
                  connections.map((conn) => (
                    <div key={conn.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-4 cursor-pointer"
                        onClick={() => router.push(`/profile/${conn.user.id}`)}
                      >
                        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                          {getUserAvatar(conn.user) ? (
                            <img src={getUserAvatar(conn.user)!} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-purple-600 font-bold text-xl">{getUserName(conn.user)[0]}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 hover:text-purple-600">{getUserName(conn.user)}</h4>
                          <p className="text-sm text-gray-500">{getUserHeadline(conn.user)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/messages?userId=${conn.user.id}`)}>
                          ✉️ Mensaje
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleRemoveConnection(conn.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="text-5xl mb-4">📬</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin solicitudes pendientes</h3>
                    <p className="text-gray-600">Las solicitudes de conexión aparecerán aquí.</p>
                  </div>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center space-x-4 cursor-pointer"
                          onClick={() => router.push(`/profile/${request.sender.id}`)}
                        >
                          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-xl">{getUserName(request.sender)[0]}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 hover:text-purple-600">{getUserName(request.sender)}</h4>
                            <p className="text-sm text-gray-500">{getUserHeadline(request.sender)}</p>
                            {request.message && (
                              <p className="text-sm text-gray-600 mt-1 italic">"{request.message}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleAcceptRequest(request.id)} className="bg-purple-600 hover:bg-purple-700">
                            Aceptar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRejectRequest(request.id)}>
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Search Results Tab */}
            {activeTab === 'search' && (
              <div className="space-y-4">
                {searchResults.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-4 cursor-pointer"
                      onClick={() => router.push(`/profile/${user.id}`)}
                    >
                      <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-xl">{getUserName(user)[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 hover:text-purple-600">{getUserName(user)}</h4>
                        <p className="text-sm text-gray-500">{getUserHeadline(user)}</p>
                      </div>
                    </div>
                    <div>
                      {user.connectionStatus === 'ACCEPTED' ? (
                        <span className="text-green-600 font-medium">✓ Conectado</span>
                      ) : user.connectionStatus === 'PENDING' ? (
                        <span className="text-yellow-600 font-medium">Pendiente</span>
                      ) : (
                        <Button size="sm" onClick={() => handleSendRequest(user.id)} className="bg-purple-600 hover:bg-purple-700">
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {activeTab === 'connections' && suggestions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personas que quizás conozcas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((user) => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => router.push(`/profile/${user.id}`)}
                      >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold">{getUserName(user)[0]}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm hover:text-purple-600">{getUserName(user)}</h4>
                          <p className="text-xs text-gray-500">{getUserHeadline(user)}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleSendRequest(user.id)}>
                        + Conectar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
