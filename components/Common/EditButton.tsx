import { cn } from "@/lib/utils";

interface EditButtonProps {
    onClick: (e: React.MouseEvent) => void;
}

export function EditButton({ onClick }: EditButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'action-button p-1.5 rounded-md',
                'text-gray-500 dark:text-gray-400',
                'hover:bg-gray-100 dark:hover:bg-slate-700',
                'cursor-pointer',
                'transition-colors'
            )}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        </button>
    );
}
