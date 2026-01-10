'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { eventsApi } from '@/lib/events';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventDetail {
  id: string;
  type: string;
  mode: string;
  status: string;
  title: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  onlineUrl?: string;
  isFree: boolean;
  price?: number;
  currency: string;
  maxAttendees?: number;
  registrationDeadline?: string;
  requiresApproval: boolean;
  viewsCount: number;
  isRegistered: boolean;
  registrationStatus?: string;
  organizer: {
    id: string;
    userProfile?: {
      firstName: string;
      lastName: string;
    };
    companyProfile?: {
      companyName: string;
      logo?: string;
      description?: string;
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

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const { isAuthenticated } = useAuthStore();
  
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const response = await eventsApi.getEvent(eventId);
      setEvent(response.data);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setRegistering(true);
    try {
      await eventsApi.registerToEvent(eventId);
      setEvent(event ? { ...event, isRegistered: true, registrationStatus: 'registered' } : null);
      alert('¡Inscripción realizada con éxito!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al inscribirse');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!confirm('¿Estás seguro de que quieres cancelar tu inscripción?')) return;

    try {
      await eventsApi.cancelRegistration(eventId);
      setEvent(event ? { ...event, isRegistered: false, registrationStatus: null } : null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cancelar');
    }
  };

  const getOrganizerName = () => {
    if (event?.organizer?.companyProfile) return event.organizer.companyProfile.companyName;
    if (event?.organizer?.userProfile) return `${event.organizer.userProfile.firstName} ${event.organizer.userProfile.lastName}`;
    return 'Organizador';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Evento no encontrado</h2>
          <Button onClick={() => router.push('/events')} className="mt-4">
            Volver a eventos
          </Button>
        </div>
      </div>
    );
  }

  const isFull = event.maxAttendees && event._count && event._count.registrations >= event.maxAttendees;
  const isPast = new Date(event.endDate) < new Date();
  const deadlinePassed = event.registrationDeadline && new Date(event.registrationDeadline) < new Date();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/events')} className="flex items-center text-gray-600 hover:text-purple-600">
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
          {/* Event Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {eventTypeLabels[event.type] || event.type}
              </span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {eventModeLabels[event.mode] || event.mode}
              </span>
              {event.isFree && (
                <span className="text-sm bg-green-500 px-3 py-1 rounded-full">
                  Gratis
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-purple-100">Organizado por {getOrganizerName()}</p>
          </div>

          {/* Quick Info */}
          <div className="p-6 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Fecha</div>
              <div className="font-medium">
                {format(new Date(event.startDate), "d 'de' MMMM, yyyy", { locale: es })}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Hora</div>
              <div className="font-medium">
                {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ubicación</div>
              <div className="font-medium">
                {event.mode === 'ONLINE' ? '💻 Online' : `📍 ${event.city || event.location || 'Por confirmar'}`}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Precio</div>
              <div className="font-medium text-green-600">
                {event.isFree ? 'Gratis' : `${event.price} ${event.currency}`}
              </div>
            </div>
          </div>

          {/* Registration */}
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                {event._count && (
                  <p className="text-gray-600">
                    👥 {event._count.registrations} inscritos
                    {event.maxAttendees && ` de ${event.maxAttendees} plazas`}
                  </p>
                )}
                {event.registrationDeadline && (
                  <p className="text-sm text-gray-500">
                    Inscripción hasta {format(new Date(event.registrationDeadline), "d 'de' MMMM", { locale: es })}
                  </p>
                )}
              </div>

              <div>
                {isPast ? (
                  <Button disabled className="bg-gray-400">
                    Evento finalizado
                  </Button>
                ) : event.isRegistered ? (
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 font-medium">✓ Inscrito</span>
                    <Button variant="outline" onClick={handleCancelRegistration}>
                      Cancelar inscripción
                    </Button>
                  </div>
                ) : isFull ? (
                  <Button disabled className="bg-gray-400">
                    Completo
                  </Button>
                ) : deadlinePassed ? (
                  <Button disabled className="bg-gray-400">
                    Inscripción cerrada
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={registering}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {registering ? 'Inscribiendo...' : 'Inscribirse'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
              <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Location Details */}
            {event.mode !== 'ONLINE' && (event.address || event.location) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Ubicación</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{event.location}</p>
                  {event.address && <p className="text-gray-600">{event.address}</p>}
                  {event.city && <p className="text-gray-600">{event.city}, {event.country}</p>}
                </div>
              </div>
            )}

            {/* Online Link */}
            {event.mode !== 'IN_PERSON' && event.isRegistered && event.onlineUrl && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Enlace de acceso</h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <a
                    href={event.onlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    💻 Acceder al evento online
                  </a>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="pt-4 border-t border-gray-100 text-sm text-gray-400">
              {event.viewsCount} visualizaciones
            </div>
          </div>

          {/* Organizer Info */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Organizador</h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                {getOrganizerName().charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{getOrganizerName()}</p>
                {event.organizer?.companyProfile?.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.organizer.companyProfile.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
