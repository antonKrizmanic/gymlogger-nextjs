'use client';

import { Activity, Dumbbell, Home, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { Logotype } from '../logo';
import { ThemeSwitcher } from '../theme/theme-switcher';
import UserAvatar from './user-avatar';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Workouts', href: '/workouts', icon: Dumbbell },
        { name: 'Exercises', href: '/exercises', icon: Activity },
    ];

    const isActive = (path: string) =>
        pathname === path || pathname.startsWith(path);

    return (
        <nav
            className={cn(
                'sticky top-0 z-50 border-b transition-all duration-300',
                scrolled
                    ? 'bg-background/80 backdrop-blur-md border-border shadow-sm'
                    : 'bg-background border-border',
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <Link
                            href="/dashboard"
                            className="flex-shrink-0 flex items-center group"
                        >
                            <div className="p-2 bg-primary/10 rounded-xl mr-3 group-hover:bg-primary/20 transition-colors">
                                <Logotype />
                            </div>
                            <span className="hidden sm:inline text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                GymNotebook
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-8 md:flex md:space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200',
                                            isActive(item.href)
                                                ? 'bg-primary/10 text-primary rounded-lg'
                                                : 'text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg',
                                        )}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {item.name}
                                        {isActive(item.href) && (
                                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeSwitcher />
                        <SessionProvider>
                            <UserAvatar />
                        </SessionProvider>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className={cn(
                                    'inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200',
                                    'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                    'focus:outline-none focus:ring-2 focus:ring-primary/20',
                                )}
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">
                                    {isMobileMenuOpen
                                        ? 'Close main menu'
                                        : 'Open main menu'}
                                </span>
                                <Menu
                                    className={cn(
                                        'h-5 w-5 transition-transform',
                                        isMobileMenuOpen
                                            ? 'rotate-90 opacity-0'
                                            : 'rotate-0 opacity-100',
                                    )}
                                />
                                <X
                                    className={cn(
                                        'h-5 w-5 absolute transition-transform',
                                        isMobileMenuOpen
                                            ? 'rotate-0 opacity-100'
                                            : '-rotate-90 opacity-0',
                                    )}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={cn(
                    'md:hidden transition-all duration-300 ease-in-out',
                    isMobileMenuOpen
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0 overflow-hidden',
                )}
            >
                <div className="px-4 pt-2 pb-4 space-y-2 bg-background/95 backdrop-blur-sm border-t border-border">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    'flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                                    isActive(item.href)
                                        ? 'bg-primary/15 text-primary border-l-4 border-primary'
                                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5',
                                )}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
