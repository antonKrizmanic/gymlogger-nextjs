import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
    onClick?: () => void;
    children: ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    loadingText?: string;
}

export function ActionButton({
    onClick,
    children,
    disabled = false,
    type = 'button',
    isLoading = false,
    loadingText = 'Loading...'
}: ActionButtonProps) {
    return (
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
                'flex items-center gap-2'
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
    );
} 