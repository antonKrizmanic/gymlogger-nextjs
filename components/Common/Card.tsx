import { cn } from "@/lib/utils";

interface CardProps {
    children: React.ReactNode;
}

export function Card({ children }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white dark:bg-slate-800 rounded-lg shadow-md p-4',
                'border border-gray-200 dark:border-gray-700',
                'hover:border-primary-500 dark:hover:border-primary-500',
                'transition-all duration-200 ease-in-out',                
                'flex flex-col gap-2'
            )}
        >
            {children}
        </div>
    )
}
