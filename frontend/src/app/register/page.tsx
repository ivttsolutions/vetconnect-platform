'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import type { RegisterData, UserType, CompanyType } from '@/types';
import { USER_TYPE_LABELS, COMPANY_TYPE_LABELS } from '@/types';

type FormData = RegisterData & { confirmPassword: string };

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

  const password = watch('password');
  const userType = watch('userType');

  const isCompanyOrShelter = userType === 'COMPANY' || userType === 'SHELTER';

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authApi.register(registerData);
      setAuth(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a la comunidad VetConnect</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soy un...</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register('userType', { required: 'Selecciona el tipo de cuenta' })}
            >
              <option value="">Selecciona una opción</option>
              {(Object.keys(USER_TYPE_LABELS) as UserType[]).map((type) => (
                <option key={type} value={type}>
                  {USER_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors.userType && (
              <p className="mt-1 text-sm text-red-500">{errors.userType.message}</p>
            )}
          </div>

          {/* Company Type - Only shown if COMPANY or SHELTER selected */}
          {isCompanyOrShelter && (
            <>
              <Input
                label={userType === 'SHELTER' ? 'Nombre del Refugio' : 'Nombre de la Empresa'}
                placeholder={userType === 'SHELTER' ? 'Refugio Animales Felices' : 'Clínica Veterinaria XYZ'}
                error={errors.companyName?.message}
                {...register('companyName', {
                  required: isCompanyOrShelter ? 'El nombre es obligatorio' : false,
                })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {userType === 'SHELTER' ? 'Tipo de Refugio' : 'Tipo de Empresa'}
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  {...register('companyType', {
                    required: isCompanyOrShelter ? 'El tipo es obligatorio' : false,
                  })}
                >
                  <option value="">Selecciona una opción</option>
                  {(Object.keys(COMPANY_TYPE_LABELS) as CompanyType[]).map((type) => (
                    <option key={type} value={type}>
                      {COMPANY_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
                {errors.companyType && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyType.message}</p>
                )}
              </div>
            </>
          )}

          {/* Personal Info - for all user types */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={isCompanyOrShelter ? 'Nombre del Contacto' : 'Nombre'}
              placeholder="Juan"
              error={errors.firstName?.message}
              {...register('firstName', {
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
            />
            <Input
              label={isCompanyOrShelter ? 'Apellido del Contacto' : 'Apellidos'}
              placeholder="García"
              error={errors.lastName?.message}
              {...register('lastName', {
                required: 'El apellido es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email no válido',
              },
            })}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Debe incluir mayúscula, minúscula y número',
              },
            })}
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirma tu contraseña',
              validate: (value) => value === password || 'Las contraseñas no coinciden',
            })}
          />

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Acepto los{' '}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Política de Privacidad
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Crear Cuenta
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-purple-600 font-medium hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
