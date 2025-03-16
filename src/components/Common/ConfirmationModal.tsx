'use client';

import { cn } from '@/src/lib/utils';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmationModal({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    isLoading = false,
    confirmText = 'Delete',
    cancelText = 'Cancel'
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
            
            {/* Modal */}
            <div className={cn(
                'relative z-50 w-full max-w-md p-6 rounded-lg',
                'bg-white dark:bg-slate-800',
                'shadow-xl'
            )}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className={cn(
                            'px-4 py-2 rounded-lg',
                            'bg-gray-100 dark:bg-slate-700',
                            'text-gray-700 dark:text-gray-300',
                            'hover:bg-gray-200 dark:hover:bg-slate-600',
                            'transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            'px-4 py-2 rounded-lg',
                            'bg-red-500',
                            'text-white',
                            'hover:bg-red-600',
                            'transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'flex items-center gap-2'
                        )}
                    >
                        {isLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
} 