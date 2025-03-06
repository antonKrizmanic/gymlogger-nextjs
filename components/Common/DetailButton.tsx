import { cn } from "@/lib/utils";

interface DetailButtonProps {
    onClick: () => void;
}


export function DetailButton({ onClick }: DetailButtonProps) {
    return (
        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                            className={cn(
                                'action-button p-1.5 rounded-md',
                                'text-gray-500 dark:text-gray-400',
                                'hover:bg-gray-100 dark:hover:bg-slate-700',
                                'transition-colors'
                            )}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
    );
}
