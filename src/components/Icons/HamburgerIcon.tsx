import { cn } from "@/src/lib/utils";

interface HamburgerIconProps {
    className?: string;
    size?: number;
}

export function HamburgerIcon({ className, size = 20 }: HamburgerIconProps) {
    return (
        <svg
            className={cn('w-4 h-4', className)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width={size}
            height={size}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}
