'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { eventsApi } from '@/lib/events';
import { Button } from '@/components/ui/button';

export default function CreateEventPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'CONFERENCE',
    mode: 'IN_PERSON',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '18:00',
    timezone: 'Europe/Madrid',
    location: '',
    address: '',
    city: '',
    country: 'España',
    onlineUrl: '',
    isFree: true,
    price: '',
    currency: 'EUR',
    maxAttendees: '',
    registrationDeadline: '',
    requiresApproval: false,
  });

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.startDate || !form.endDate) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
      const endDateTime = new Date(`${form.endDate}T${form.endTime}`);

      const data = {
        title: form.title,
        description: form.description,
        type: form.type,
        mode: form.mode,
        startDate: startDateTime,
        endDate: endDateTime,
        timezone: form.timezone,
        location: form.location || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
        onlineUrl: form.onlineUrl || undefined,
        isFree: form.isFree,
        price: !form.isFree && form.price ? parseFloat(form.price) : undefined,
        currency: form.currency,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : undefined,
        registrationDeadline: form.registrationDeadline ? new Date(form.registrationDeadline) : undefined,
        requiresApproval: form.requiresApproval,
      };

      await eventsApi.createEvent(data);
      alert('¡Evento creado con éxito!');
      router.push('/events');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear evento');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/events')} className="text-gray-600 hover:text-purple-600">
            ← Volver
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600">VetConnect</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear evento</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del evento *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Congreso Nacional de Veterinaria 2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de evento *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="CONFERENCE">Conferencia</option>
                  <option value="WORKSHOP">Taller</option>
                  <option value="SEMINAR">Seminario</option>
                  <option value="WEBINAR">Webinar</option>
                  <option value="COURSE">Curso</option>
                  <option value="CONGRESS">Congreso</option>
                  <option value="MEETUP">Meetup</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad *
                </label>
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="IN_PERSON">Presencial</option>
                  <option value="ONLINE">Online</option>
                  <option value="HYBRID">Híbrido</option>
                </select>
              </div>
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha inicio *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora inicio *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha fin *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora fin *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Ubicación (solo si no es online) */}
            {form.mode !== 'ONLINE' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del lugar
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ej: Palacio de Congresos"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Calle, número..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Madrid"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* URL online (solo si no es presencial) */}
            {form.mode !== 'IN_PERSON' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace de acceso online
                </label>
                <input
                  type="url"
                  name="onlineUrl"
                  value={form.onlineUrl}
                  onChange={handleChange}
                  placeholder="https://zoom.us/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe el evento, agenda, ponentes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={form.isFree}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Evento gratuito
                </label>
              </div>

              {!form.isFree && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="50.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda
                    </label>
                    <select
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="MXN">MXN</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Capacidad y registro */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad máxima
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={form.maxAttendees}
                  onChange={handleChange}
                  min="1"
                  placeholder="Sin límite"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha límite inscripción
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={form.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="requiresApproval"
                checked={form.requiresApproval}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Requiere aprobación manual de inscripciones
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/events')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Creando...' : 'Crear evento'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
