'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../src/Api/Services/AuthService';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {        
        try {
            setError(null);
            const authService = new AuthService();
            await authService.login({
                email: data.email,
                password: data.password,
            });            
            router.push('/');
        } catch (_err) {
            setError('Invalid email or password');
            console.error(_err);
        }
    };
    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={cn(
                        'w-full px-4 py-2 rounded-lg',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white',
                        'placeholder-gray-500 dark:placeholder-gray-400'
                    )}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className={cn(
                        'w-full px-4 py-2 rounded-lg',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white',
                        'placeholder-gray-500 dark:placeholder-gray-400'
                    )}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                    'w-full px-4 py-2 rounded-lg',
                    'bg-white dark:bg-slate-800',
                    'border border-gray-300 dark:border-gray-700',
                    'text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-50 dark:hover:bg-slate-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed',                    
                )}                
            >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
} 