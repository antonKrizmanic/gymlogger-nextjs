import { cn } from '@/lib/utils';

interface PlusIconProps {
    className?: string;
    size?: number;
}

export function PlusIcon({ className, size = 20 }: PlusIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={cn('w-5 h-5', className)}
            width={size}
            height={size}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
            />
        </svg>
    );
} 