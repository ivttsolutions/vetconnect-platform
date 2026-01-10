'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { eventsApi } from '@/lib/events';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Event {
  id: string;
  type: string;
  mode: string;
  title: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  location?: string;
  city?: string;
  country?: string;
  onlineUrl?: string;
  isFree: boolean;
  price?: number;
  currency: string;
  maxAttendees?: number;
  organizer: {
    id: string;
    userProfile?: {
      firstName: string;
      lastName: string;
    };
    companyProfile?: {
      companyName: string;
      logo?: string;
    };
  };
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

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'online' | 'presencial'>('all');

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsApi.getEvents({
        upcoming: true,
        mode: filter === 'online' ? 'ONLINE' : filter === 'presencial' ? 'IN_PERSON' : undefined,
      });
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrganizerName = (event: Event) => {
    if (event.organizer?.companyProfile) return event.organizer.companyProfile.companyName;
    if (event.organizer?.userProfile) return `${event.organizer.userProfile.firstName} ${event.organizer.userProfile.lastName}`;
    return 'Organizador';
  };

  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return `${format(start, "d 'de' MMMM, yyyy", { locale: es })} · ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    }
    return `${format(start, "d MMM", { locale: es })} - ${format(end, "d MMM, yyyy", { locale: es })}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
          <nav className="flex items-center space-x-4">
            <button onClick={() => router.push('/feed')} className="text-gray-600 hover:text-purple-600">
              Feed
            </button>
            <button onClick={() => router.push('/network')} className="text-gray-600 hover:text-purple-600">
              Red
            </button>
            <button onClick={() => router.push('/jobs')} className="text-gray-600 hover:text-purple-600">
              💼
            </button>
            <button onClick={() => router.push('/events')} className="text-purple-600 font-medium">
              📅 Eventos
            </button>
            <button onClick={() => router.push('/messages')} className="text-gray-600 hover:text-purple-600">
              ✉️
            </button>
            <button onClick={() => router.push('/profile')} className="text-gray-600 hover:text-purple-600">
              Perfil
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
            <p className="text-sm text-gray-500">Conferencias, talleres y formación veterinaria</p>
          </div>
          {isAuthenticated && (
            <div className="flex gap-2">
              <Button onClick={() => router.push('/events/my-events')} variant="outline">
                Mis eventos
              </Button>
              <Button onClick={() => router.push('/events/create')} className="bg-purple-600 hover:bg-purple-700">
                + Crear evento
              </Button>
            </div>
          )}
        </div>

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
            onClick={() => setFilter('presencial')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'presencial' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📍 Presencial
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              filter === 'online' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💻 Online
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay eventos próximos</h3>
            <p className="text-gray-600">Vuelve más tarde para ver nuevos eventos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push(`/events/${event.id}`)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  {/* Date Badge */}
                  <div className="bg-purple-600 text-white p-4 flex flex-col items-center justify-center min-w-[80px]">
                    <span className="text-2xl font-bold">
                      {format(new Date(event.startDate), 'd')}
                    </span>
                    <span className="text-sm uppercase">
                      {format(new Date(event.startDate), 'MMM', { locale: es })}
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {eventTypeLabels[event.type] || event.type}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            event.mode === 'ONLINE' ? 'bg-blue-100 text-blue-700' :
                            event.mode === 'HYBRID' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {eventModeLabels[event.mode] || event.mode}
                          </span>
                          {event.isFree && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Gratis
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{getOrganizerName(event)}</p>
                      </div>
                      
                      {!event.isFree && event.price && (
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">
                            {event.price} {event.currency}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center text-sm text-gray-500 space-x-4">
                      <span>🕐 {formatEventDate(event.startDate, event.endDate)}</span>
                      {event.city && <span>📍 {event.city}</span>}
                      {event._count && (
                        <span>👥 {event._count.registrations} inscritos</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
