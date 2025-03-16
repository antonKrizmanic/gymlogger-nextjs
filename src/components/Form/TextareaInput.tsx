import { cn } from "@/src/lib/utils";

interface TextareaInputProps {
    label: string;
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
}

export function TextareaInput({ label, id, value, onChange }: TextareaInputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className={cn(
                    'mt-1 w-full px-3 py-2 rounded-lg',
                    'bg-white dark:bg-slate-800',
                    'border border-gray-300 dark:border-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500',
                    'text-gray-900 dark:text-white'
                )}
            />
        </div>
    );
}


