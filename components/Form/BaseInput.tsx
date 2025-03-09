import { cn } from "@/lib/utils";

interface BaseInputProps {
    type: string;
    label?: string;
    placeholder?: string;
    id: string;
    value: string | number | undefined;
    onChange: (value: string) => void;
    className?: string;
}

export function BaseInput({ type, label, placeholder, id, value, onChange, className }: BaseInputProps) {
    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn("mt-1 w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white", className)}   
            />
        </div>
    );
}
