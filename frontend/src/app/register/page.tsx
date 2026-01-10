'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import type { RegisterData } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join the VetConnect community</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'Min 2 characters' },
              })}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'Min 2 characters' },
              })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Min 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Must include uppercase, lowercase and number',
              },
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register('userType', { required: 'Please select user type' })}
            >
              <option value="USER">Veterinary Professional</option>
              <option value="COMPANY">Company / Clinic</option>
              <option value="SHELTER">Animal Shelter</option>
            </select>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
