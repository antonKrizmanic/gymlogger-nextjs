import { cn } from "@/lib/utils";

interface LogoutIconProps {
    className?: string;
    size?: number;
}

export function LogoutIcon({ className, size = 20 }: LogoutIconProps) {
    return (
        <svg
            className={cn('w-4 h-4', className)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
    );
}


