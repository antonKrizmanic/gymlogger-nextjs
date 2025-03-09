'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { MoonIcon, SunIcon } from '../Icons';

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
                'p-2 rounded-md transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="Toggle theme"
        >
            {/* Sun icon */}
            <SunIcon className={cn(theme === 'dark' ? 'hidden' : 'block')} />            

            {/* Moon icon */}
            <MoonIcon className={cn(theme === 'dark' ? 'block' : 'hidden')} />            
        </button>
    );
} 