import { cn } from '@/lib/utils';
import { ExerciseLogType } from '@/src/Types/Enums';
import { IExerciseSetCreate } from '@/src/Models/Domain/Workout';

interface ExerciseSetProps {
    set: IExerciseSetCreate;
    index: number;
    exerciseType: ExerciseLogType;
    onSetChange: (set: IExerciseSetCreate) => void;
    onCopy: () => void;
    onRemove: () => void;
}

export function ExerciseSet({ set, index, exerciseType, onSetChange, onCopy, onRemove }: ExerciseSetProps) {
    const handleWeightChange = (value: string) => {
        onSetChange({
            ...set,
            weight: value ? Number(value) : undefined
        });
    };

    const handleRepsChange = (value: string) => {
        onSetChange({
            ...set,
            reps: value ? Number(value) : undefined
        });
    };

    const handleTimeChange = (value: string) => {
        onSetChange({
            ...set,
            time: value ? Number(value) : undefined
        });
    };

    const handleNoteChange = (value: string) => {
        onSetChange({
            ...set,
            note: value
        });
    };

    return (
        <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-900">
            {/* Set number */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                {index + 1}
            </div>

            {/* Set inputs */}
            <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Weight input (for WeightAndReps) */}
                {exerciseType === ExerciseLogType.WeightAndReps && (
                    <div>
                        <label htmlFor={`weight-${set.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            id={`weight-${set.id}`}
                            value={set.weight || ''}
                            onChange={(e) => handleWeightChange(e.target.value)}
                            min="0"
                            step="0.5"
                            className={cn(
                                'mt-1 w-full px-3 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                'text-gray-900 dark:text-white'
                            )}
                        />
                    </div>
                )}

                {/* Reps input (for WeightAndReps and RepsOnly) */}
                {(exerciseType === ExerciseLogType.WeightAndReps || exerciseType === ExerciseLogType.RepsOnly) && (
                    <div>
                        <label htmlFor={`reps-${set.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Reps
                        </label>
                        <input
                            type="number"
                            id={`reps-${set.id}`}
                            value={set.reps || ''}
                            onChange={(e) => handleRepsChange(e.target.value)}
                            min="0"
                            className={cn(
                                'mt-1 w-full px-3 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                'text-gray-900 dark:text-white'
                            )}
                        />
                    </div>
                )}

                {/* Time input (for TimeOnly) */}
                {exerciseType === ExerciseLogType.TimeOnly && (
                    <div>
                        <label htmlFor={`time-${set.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Time (seconds)
                        </label>
                        <input
                            type="number"
                            id={`time-${set.id}`}
                            value={set.time || ''}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            min="0"
                            className={cn(
                                'mt-1 w-full px-3 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                'text-gray-900 dark:text-white'
                            )}
                        />
                    </div>
                )}

                {/* Notes field */}
                <div className="col-span-2">
                    <label htmlFor={`note-${set.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes
                    </label>
                    <input
                        type="text"
                        id={`note-${set.id}`}
                        value={set.note || ''}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder="Optional notes..."
                        className={cn(
                            'mt-1 w-full px-3 py-2 rounded-lg',
                            'bg-white dark:bg-slate-800',
                            'border border-gray-300 dark:border-gray-700',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500',
                            'text-gray-900 dark:text-white'
                        )}
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-start gap-2">
                <button
                    type="button"
                    onClick={onCopy}
                    className="p-2 text-gray-400 hover:text-primary-500"
                    title="Copy set"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2 text-gray-400 hover:text-red-500"
                    title="Remove set"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
} 