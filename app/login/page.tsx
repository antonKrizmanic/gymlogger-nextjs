'use client';

import { LoginForm } from '@/components/Auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
                    Sign in to your account
                </p>
            </div>

            <LoginForm />
        </div>
    );
} 