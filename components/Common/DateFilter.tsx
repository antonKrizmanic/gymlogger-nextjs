import { cn } from '@/lib/utils';

interface DateFilterProps {
    date?: Date;
    onDateChange: (date: Date | undefined) => void;
    isOpen: boolean;
}

export function DateFilter({
    date,
    onDateChange,
    isOpen
}: DateFilterProps) {
    if (!isOpen) return null;

    return (
        <div className={cn(
            'p-4 rounded-lg',
            'bg-white dark:bg-slate-800',
            'border border-gray-300 dark:border-gray-700',
            'space-y-4'
        )}>
            <div className="space-y-2">
                <label htmlFor="workoutDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Workout Date
                </label>
                <input
                    type="date"
                    id="workoutDate"
                    value={date?.toISOString().split('T')[0] || ''}
                    onChange={(e) => onDateChange(e.target.value ? new Date(e.target.value) : undefined)}
                    className={cn(
                        'w-full px-3 py-2 rounded-lg',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white'
                    )}
                />
            </div>
        </div>
    );
} 