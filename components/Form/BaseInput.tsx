interface BaseInputProps {
    type: string;
    label: string;
    id: string;
    value: string | number | undefined;
    onChange: (value: string) => void;
}

export function BaseInput({ type, label, id, value, onChange }: BaseInputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
        </div>
    );
}
