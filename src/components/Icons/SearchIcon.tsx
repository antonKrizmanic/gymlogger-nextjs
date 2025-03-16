import { cn } from "@/src/lib/utils";

interface SearchIconProps {
    className?: string;
    size?: number;
}

export function SearchIcon({ className, size = 24 }: SearchIconProps) {
    return (
        <svg
            className={cn("absolute right-3 top-3.5 h-5 w-5 text-gray-400", className)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width={size}
            height={size}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );
}

