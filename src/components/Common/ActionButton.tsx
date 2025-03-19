import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';

interface ActionButtonProps {
    href?: string;
    onClick?: () => void;
    children: ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
}

export function ActionButton({
    href,
    onClick,
    children,
    disabled = false,
    type = 'button',
    isLoading = false,
    loadingText = 'Loading...',
    className = ''
}: ActionButtonProps) {
    return (
        href ? (
            <Link
                href={href}
                className={cn(
                    'px-4 py-2 rounded-lg',
                    'bg-white dark:bg-slate-800',
                    'border border-gray-300 dark:border-gray-700',
                    'text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-50 dark:hover:bg-slate-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center gap-2',
                    className
                )}
            >
                {children}
            </Link>
        ) : (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled || isLoading}
            className={cn(
                'px-4 py-2 rounded-lg',
                'bg-white dark:bg-slate-800',
                'border border-gray-300 dark:border-gray-700',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-slate-700',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center gap-2',
                'cursor-pointer',
                className
            )}
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-gray-700 dark:border-gray-300 rounded-full animate-spin" />
                    {loadingText}
                </>
                ) : (
                    children
                )}
            </button>
        )
    );
} 