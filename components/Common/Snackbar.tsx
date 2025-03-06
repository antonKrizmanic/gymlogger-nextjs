import { cn } from "@/lib/utils";
import { useEffect } from "react";

type SnackbarType = 'success' | 'error' | 'warning';

interface SnackbarProps {
    text: string;
    type: SnackbarType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Snackbar({ text, type, isVisible, onClose, duration = 3000 }: SnackbarProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const typeStyles = {
        success: 'bg-green-500 dark:bg-green-600',
        error: 'bg-red-500 dark:bg-red-600',
        warning: 'bg-yellow-500 dark:bg-yellow-600'
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={cn(
                    'px-4 py-3 rounded-lg shadow-lg',
                    'text-white font-medium',
                    'flex items-center gap-2',
                    'min-w-[300px]',
                    'animate-fade-in-right',
                    typeStyles[type]
                )}
            >
                {/* Icon based on type */}
                {type === 'success' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {type === 'warning' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                )}
                
                <span>{text}</span>
            </div>
        </div>
    );
}

interface SuccessSnackbarProps {
    text?: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function SuccessSnackbar({ 
    text = "Operation completed successfully!", 
    isVisible, 
    onClose, 
    duration 
}: SuccessSnackbarProps) {
    return (
        <Snackbar
            text={text}
            type="success"
            isVisible={isVisible}
            onClose={onClose}
            duration={duration}
        />
    );
}

interface ErrorSnackbarProps {
    text?: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function ErrorSnackbar({ 
    text = "An error occurred. Please try again.", 
    isVisible, 
    onClose, 
    duration 
}: ErrorSnackbarProps) {
    return (
        <Snackbar
            text={text}
            type="error"
            isVisible={isVisible}
            onClose={onClose}
            duration={duration}
        />
    );
}

interface WarningSnackbarProps {
    text?: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function WarningSnackbar({ 
    text = "Please review your input.", 
    isVisible, 
    onClose, 
    duration 
}: WarningSnackbarProps) {
    return (
        <Snackbar
            text={text}
            type="warning"
            isVisible={isVisible}
            onClose={onClose}
            duration={duration}
        />
    );
} 