'use client';

import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" onClick={onCancel} />

            {/* Modal */}
            <div className={cn(
                'relative z-[9999] w-full max-w-md p-6 rounded-lg',
                'bg-white dark:bg-slate-800',
                'shadow-overlay'
            )}>
                <h3 className="type-heading-sm text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>
                <p className="type-body-md text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={onCancel}
                        variant="outline"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={cn(
                            'px-4 py-2 rounded-lg',
                            'bg-red-500',
                            'text-white',
                            'hover:bg-red-600',
                            'transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                    >
                        {isLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                        )}
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
} 