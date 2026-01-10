'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { eventsApi } from '@/lib/events';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventRegistration {
  id: string;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    type: string;
    mode: string;
    startDate: string;
    endDate: string;
    city?: string;
    isFree: boolean;
    organizer: {
      companyProfile?: {
        companyName: string;
      };
      userProfile?: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

interface OrganizedEvent {
  id: string;
  title: string;
  type: string;
  mode: string;
  status: string;
  startDate: string;
  endDate: string;
  city?: string;
  isFree: boolean;
  _count?: {
    registrations: number;
  };
}

const eventTypeLabels: Record<string, string> = {
  CONFERENCE: 'Conferencia',
  WORKSHOP: 'Taller',
  SEMINAR: 'Seminario',
  WEBINAR: 'Webinar',
  COURSE: 'Curso',
  CONGRESS: 'Congreso',
  MEETUP: 'Meetup',
  OTHER: 'Otro',
};

const eventModeLabels: Record<string, string> = {
  IN_PERSON: 'Presencial',
  ONLINE: 'Online',
  HYBRID: 'Híbrido',
};

export default function MyEventsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<OrganizedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'attending' | 'organized'>('attending');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [regResponse, orgResponse] = await Promise.all([
        eventsApi.getMyRegistrations(),
        eventsApi.getMyOrganizedEvents(),
      ]);
      setRegistrations(regResponse.data || []);
      setOrganizedEvents(orgResponse.data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrganizerName = (event: EventRegistration['event']) => {
    if (event.organizer?.companyProfile) return event.organizer.companyProfile.companyName;
    if (event.organizer?.userProfile) return `${event.organizer.userProfile.firstName} ${event.organizer.userProfile.lastName}`;
    return 'Organizador';
  };

  const isPastEvent = (endDate: string) => new Date(endDate) < new Date();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/events')} className="text-gray-600 hover:text-purple-600">
            ← Volver a eventos
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis eventos</h1>
            <p className="text-sm text-gray-500">Eventos a los que asistes y que organizas</p>
          </div>
          <Button onClick={() => router.push('/events/create')} className="bg-purple-600 hover:bg-purple-700">
            + Crear evento
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-xl shadow-sm p-1">
          <button
            onClick={() => setTab('attending')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              tab === 'attending' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎫 Asistiendo ({registrations.length})
          </button>
          <button
            onClick={() => setTab('organized')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              tab === 'organized' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📋 Organizados ({organizedEvents.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : tab === 'attending' ? (
          /* Attending Events */
          registrations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No estás inscrito a ningún evento</h3>
              <p className="text-gray-600 mb-4">Explora los eventos disponibles y regístrate.</p>
              <Button onClick={() => router.push('/events')} className="bg-purple-600 hover:bg-purple-700">
                Ver eventos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => router.push(`/events/${reg.event.id}`)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    <div className={`p-4 flex flex-col items-center justify-center min-w-[80px] ${
                      isPastEvent(reg.event.endDate) ? 'bg-gray-400' : 'bg-purple-600'
                    } text-white`}>
                      <span className="text-2xl font-bold">
                        {format(new Date(reg.event.startDate), 'd')}
                      </span>
                      <span className="text-sm uppercase">
                        {format(new Date(reg.event.startDate), 'MMM', { locale: es })}
                      </span>
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              {eventTypeLabels[reg.event.type] || reg.event.type}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              reg.event.mode === 'ONLINE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {eventModeLabels[reg.event.mode] || reg.event.mode}
                            </span>
                            {isPastEvent(reg.event.endDate) && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                Finalizado
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{reg.event.title}</h3>
                          <p className="text-sm text-gray-600">{getOrganizerName(reg.event)}</p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                          reg.status === 'registered' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {reg.status === 'approved' ? '✓ Confirmado' : 
                           reg.status === 'registered' ? 'Pendiente' : reg.status}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        🕐 {format(new Date(reg.event.startDate), "d MMM yyyy, HH:mm", { locale: es })}
                        {reg.event.city && <span className="ml-4">📍 {reg.event.city}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Organized Events */
          organizedEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No has organizado ningún evento</h3>
              <p className="text-gray-600 mb-4">Crea tu primer evento y compártelo con la comunidad.</p>
              <Button onClick={() => router.push('/events/create')} className="bg-purple-600 hover:bg-purple-700">
                Crear evento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {organizedEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    <div className={`p-4 flex flex-col items-center justify-center min-w-[80px] ${
                      event.status === 'CANCELLED' ? 'bg-red-500' :
                      isPastEvent(event.endDate) ? 'bg-gray-400' : 'bg-purple-600'
                    } text-white`}>
                      <span className="text-2xl font-bold">
                        {format(new Date(event.startDate), 'd')}
                      </span>
                      <span className="text-sm uppercase">
                        {format(new Date(event.startDate), 'MMM', { locale: es })}
                      </span>
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              {eventTypeLabels[event.type] || event.type}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              event.mode === 'ONLINE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {eventModeLabels[event.mode] || event.mode}
                            </span>
                            {event.status === 'CANCELLED' && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                Cancelado
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold text-purple-600">
                            👥 {event._count?.registrations || 0}
                          </span>
                          <p className="text-xs text-gray-500">inscritos</p>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-500">
                        🕐 {format(new Date(event.startDate), "d MMM yyyy, HH:mm", { locale: es })}
                        {event.city && <span className="ml-4">📍 {event.city}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
