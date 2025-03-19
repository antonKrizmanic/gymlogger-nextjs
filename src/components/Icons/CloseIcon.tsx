import { cn } from "@/src/lib/utils";

interface CloseIconProps {
    className?: string;
    size?: number;
}

export function CloseIcon({ className, size = 20 }: CloseIconProps) {
    return (
        <svg 
            className={cn('w-4 h-4', className)}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}


