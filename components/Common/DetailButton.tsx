import { cn } from "@/lib/utils";
import { EyeIcon } from "@/components/Icons";

interface DetailButtonProps {
    onClick: (e: React.MouseEvent) => void;
}

export function DetailButton({ onClick }: DetailButtonProps) {
    return (
        <div className={cn(
            'border border-gray-300 dark:border-gray-700 p-1 w-full flex justify-center items-center',
            'hover:bg-gray-100 dark:hover:bg-slate-700',
            'cursor-pointer',
            'transition-colors'
        )}>
            <button
                onClick={onClick}
                className={cn(
                    'action-button p-1.5 rounded-md',
                    'text-gray-500 dark:text-gray-400',     
                    'cursor-pointer'               
                )}
            >
                <EyeIcon />
            </button>
        </div>
    );
}
