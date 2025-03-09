import { cn } from "@/lib/utils";

interface MoonIconProps {
    className?: string;
    size?: number;
}

export function MoonIcon({ className, size = 20 }: MoonIconProps) {
    return (
        <svg
            className={cn(
                'w-5 h-5',
                'text-gray-600 dark:text-gray-400',
                className
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    );
}

