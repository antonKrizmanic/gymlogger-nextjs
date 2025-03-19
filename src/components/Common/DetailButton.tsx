import { cn } from "@/src/lib/utils";
import { EyeIcon } from "@/src/components/Icons";
import Link from "next/link";

interface DetailButtonProps {
    href: string;
}

export function DetailButton({ href }: DetailButtonProps) {
    return (
        <div className={cn(
            'border border-gray-300 dark:border-gray-700 p-1 w-full flex justify-center items-center',
            'hover:bg-gray-100 dark:hover:bg-slate-700',
            'cursor-pointer',
            'transition-colors'
        )}>
            <Link
                href={href}
                className={cn(
                    'action-button p-1.5 rounded-md',
                    'text-gray-500 dark:text-gray-400',     
                    'cursor-pointer'               
                )}
            >
                <EyeIcon />
            </Link>
        </div>
    );
}
