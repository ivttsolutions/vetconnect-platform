'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { profileApi } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EditProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getMyProfile();
      setProfile(response.data);
      reset(response.data.userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await profileApi.updateProfile(data);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error al actualizar' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const response = await profileApi.uploadAvatar(file);
      setProfile((prev: any) => ({
        ...prev,
        userProfile: { ...prev.userProfile, avatar: response.data.avatar },
      }));
      setMessage({ type: 'success', text: 'Avatar actualizado' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error al subir el avatar' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const userProfile = profile?.userProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <span>←</span>
            <span>Volver al perfil</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Editar Perfil</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Avatar Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto de Perfil</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
              {userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">
                  {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                </span>
              )}
            </div>
            <div>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => avatarInputRef.current?.click()}
                isLoading={uploadingAvatar}
              >
                Cambiar foto
              </Button>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG. Máx 5MB</p>
            </div>
          </div>
        </div>

        {/* Basic Info Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                {...register('firstName', { required: 'Requerido' })}
                error={errors.firstName?.message as string}
              />
              <Input
                label="Apellidos"
                {...register('lastName', { required: 'Requerido' })}
                error={errors.lastName?.message as string}
              />
              <div className="md:col-span-2">
                <Input
                  label="Título Profesional"
                  placeholder="Ej: Veterinario Especialista en Pequeños Animales"
                  {...register('headline')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Cuéntanos sobre ti..."
                  {...register('bio')}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Profesional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número de Colegiado"
                placeholder="Ej: 12345"
                {...register('licenseNumber')}
              />
              <Input
                label="Años de Experiencia"
                type="number"
                {...register('yearsOfExperience', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="País" {...register('country')} />
              <Input label="Ciudad" {...register('city')} />
              <Input label="Dirección" {...register('address')} />
              <Input label="Código Postal" {...register('postalCode')} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacto y Redes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Teléfono" {...register('phone')} />
              <Input label="Sitio Web" placeholder="https://" {...register('website')} />
              <Input label="LinkedIn" placeholder="https://linkedin.com/in/" {...register('linkedIn')} />
              <Input label="Twitter" placeholder="@usuario" {...register('twitter')} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferencias</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  {...register('showEmail')}
                />
                <span className="text-gray-700">Mostrar email en mi perfil</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  {...register('showPhone')}
                />
                <span className="text-gray-700">Mostrar teléfono en mi perfil</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  {...register('openToOpportunities')}
                />
                <span className="text-gray-700">Abierto a oportunidades laborales</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/profile">
              <Button variant="outline" type="button">Cancelar</Button>
            </Link>
            <Button type="submit" isLoading={saving}>
              Guardar Cambios
            </Button>
          </div>
        </form>

        {/* Experience Section */}
        <ExperienceSection
          experiences={userProfile?.experiences || []}
          onUpdate={loadProfile}
        />

        {/* Education Section */}
        <EducationSection
          educations={userProfile?.educations || []}
          onUpdate={loadProfile}
        />

        {/* Skills Section */}
        <SkillsSection
          skills={userProfile?.skills || []}
          onUpdate={loadProfile}
        />
      </div>
    </div>
  );
}

// Experience Section Component
function ExperienceSection({ experiences, onUpdate }: { experiences: any[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await profileApi.addExperience(data);
      reset();
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding experience:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta experiencia?')) return;
    try {
      await profileApi.deleteExperience(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  return (
    <div id="experience" className="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Experiencia</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Añadir'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
          <Input label="Cargo" {...register('title', { required: true })} />
          <Input label="Empresa" {...register('companyName', { required: true })} />
          <Input label="Ubicación" {...register('location')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha Inicio" type="date" {...register('startDate', { required: true })} />
            <Input label="Fecha Fin" type="date" {...register('endDate')} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('current')} />
            <span className="text-sm">Trabajo actual</span>
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Descripción"
            rows={3}
            {...register('description')}
          />
          <Button type="submit" isLoading={saving}>Guardar</Button>
        </form>
      )}

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">{exp.title}</h3>
              <p className="text-gray-600 text-sm">{exp.companyName}</p>
            </div>
            <button onClick={() => handleDelete(exp.id)} className="text-red-500 text-sm hover:underline">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Education Section Component
function EducationSection({ educations, onUpdate }: { educations: any[]; onUpdate: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await profileApi.addEducation(data);
      reset();
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding education:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta educación?')) return;
    try {
      await profileApi.deleteEducation(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  return (
    <div id="education" className="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Educación</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Añadir'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
          <Input label="Institución" {...register('institution', { required: true })} />
          <Input label="Título" {...register('degree', { required: true })} />
          <Input label="Campo de Estudio" {...register('fieldOfStudy')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha Inicio" type="date" {...register('startDate', { required: true })} />
            <Input label="Fecha Fin" type="date" {...register('endDate')} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('current')} />
            <span className="text-sm">Actualmente estudiando</span>
          </label>
          <Button type="submit" isLoading={saving}>Guardar</Button>
        </form>
      )}

      <div className="space-y-3">
        {educations.map((edu) => (
          <div key={edu.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">{edu.degree}</h3>
              <p className="text-gray-600 text-sm">{edu.institution}</p>
            </div>
            <button onClick={() => handleDelete(edu.id)} className="text-red-500 text-sm hover:underline">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills Section Component
function SkillsSection({ skills, onUpdate }: { skills: any[]; onUpdate: () => void }) {
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newSkill.trim()) return;
    setSaving(true);
    try {
      await profileApi.addSkill(newSkill.trim());
      setNewSkill('');
      onUpdate();
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await profileApi.deleteSkill(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div id="skills" className="bg-white rounded-2xl shadow-sm p-6 mt-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Nueva habilidad"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        />
        <Button onClick={handleAdd} isLoading={saving}>Añadir</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
          >
            {skill.name}
            <button
              onClick={() => handleDelete(skill.id)}
              className="ml-1 text-purple-500 hover:text-purple-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
