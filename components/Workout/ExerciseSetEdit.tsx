import { IExerciseSetCreate } from '@/src/Models/Domain/Workout';
import { ExerciseLogType } from '@/src/Types/Enums';
import { cn } from '@/lib/utils';

interface ExerciseSetEditProps {
    set: IExerciseSetCreate;
    index: number;
    exerciseType: ExerciseLogType;
    onSetChange: (updatedSet: IExerciseSetCreate) => void;
    onCopy: () => void;
    onRemove: () => void;
}

export function ExerciseSetEdit({ set, index, exerciseType, onSetChange, onCopy, onRemove }: ExerciseSetEditProps) {
    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = parseFloat(e.target.value) || 0;
        onSetChange({ ...set, weight });
    };

    const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reps = parseInt(e.target.value) || 0;
        onSetChange({ ...set, reps });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseInt(e.target.value) || 0;
        onSetChange({ ...set, time });
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSetChange({ ...set, note: e.target.value });
    };

    return (
        <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                {index + 1}
            </span>
            {exerciseType === ExerciseLogType.WeightAndReps && (
                <>
                    <div className="flex-1">
                        <input
                            type="number"
                            value={set.weight || ''}
                            onChange={handleWeightChange}
                            placeholder="Weight"
                            className={cn(
                                'w-full px-3 py-1 rounded-lg text-sm',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                'text-gray-900 dark:text-white'
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            type="number"
                            value={set.reps || ''}
                            onChange={handleRepsChange}
                            placeholder="Reps"
                            className={cn(
                                'w-full px-3 py-1 rounded-lg text-sm',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                'text-gray-900 dark:text-white'
                            )}
                        />
                    </div>
                </>
            )}
            {exerciseType === ExerciseLogType.RepsOnly && (
                <div className="flex-1">
                    <input
                        type="number"
                        value={set.reps || ''}
                        onChange={handleRepsChange}
                        placeholder="Reps"
                        className={cn(
                            'w-full px-3 py-1 rounded-lg text-sm',
                            'bg-white dark:bg-slate-800',
                            'border border-gray-300 dark:border-gray-700',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500',
                            'text-gray-900 dark:text-white'
                        )}
                    />
                </div>
            )}
            {exerciseType === ExerciseLogType.TimeOnly && (
                <div className="flex-1">
                    <input
                        type="number"
                        value={set.time || ''}
                        onChange={handleTimeChange}
                        placeholder="Time (s)"
                        className={cn(
                            'w-full px-3 py-1 rounded-lg text-sm',
                            'bg-white dark:bg-slate-800',
                            'border border-gray-300 dark:border-gray-700',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500',
                            'text-gray-900 dark:text-white'
                        )}
                    />
                </div>
            )}
            <div className="flex-1">
                <input
                    type="text"
                    value={set.note || ''}
                    onChange={handleNoteChange}
                    placeholder="Notes"
                    className={cn(
                        'w-full px-3 py-1 rounded-lg text-sm',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white'
                    )}
                />
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onCopy}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1 text-gray-400 hover:text-red-500"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
} 