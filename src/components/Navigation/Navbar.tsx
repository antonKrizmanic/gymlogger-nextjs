'use client';

import { SessionProvider } from "next-auth/react"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import { ThemeSwitcher } from '../Theme/ThemeSwitcher';
import { Menu, X, LogOut } from "lucide-react"

import { signOut } from "next-auth/react"
import UserAvatar from './UserAvatar';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

   
    const navItems = [
        { name: 'Workouts', href: '/workouts' },
        { name: 'Exercises', href: '/exercises' },
    ];

    const isActive = (path: string) => pathname === path;

    const handleLogout = () => {
        signOut();
    };

    return (
        <nav className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">GymNotebook</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                        isActive(item.href)
                                            ? 'border-gray-700 text-gray-700 dark:text-gray-300 dark:border-gray-300'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center">
                        {/* Theme Switcher */}
                        <ThemeSwitcher />

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className={cn(
                                'ml-4 p-2 rounded-md',
                                'text-gray-500 dark:text-gray-400',
                                'hover:bg-gray-100 dark:hover:bg-slate-800',
                                'transition-colors'
                            )}
                            title="Sign out"
                        >
                            <LogOut />
                        </button>
                        <SessionProvider>
                            <UserAvatar />
                        </SessionProvider>

                        {/* Mobile menu button */}
                        <div className="sm:hidden flex items-center ml-4">
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <Menu className={cn('h-6 w-6', isMobileMenuOpen ? 'hidden' : 'block')} />
                                <X className={cn('h-6 w-6', isMobileMenuOpen ? 'block' : 'hidden')} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={cn('sm:hidden', isMobileMenuOpen ? 'block' : 'hidden')}>
                <div className="pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                                isActive(item.href)
                                    ? 'border-gray-700 text-gray-700 dark:text-gray-300 dark:border-gray-300'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
} 