import { cn } from "@/src/lib/utils";

interface LeftArrowIconProps {
    className?: string;
    size?: number;
}

export function LeftArrowIcon({ className, size = 24 }: LeftArrowIconProps) {
    return (
        <svg 
            className={cn("w-4 h-4", className)}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );
}
