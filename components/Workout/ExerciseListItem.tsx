import { cn } from "@/lib/utils";
import { IExerciseSetCreate, IExerciseWorkout, IExerciseWorkoutCreate } from "@/src/Models/Domain/Workout";
import { ExerciseSelect } from "./ExerciseSelect";
import { ExerciseLogType } from "@/src/Types/Enums";
import { ExerciseSetEdit } from "./ExerciseSetEdit";
import { useEffect, useState } from "react";
import { ExerciseWorkoutService } from "@/src/Api/Services/ExerciseWorkoutService";
import { ExerciseSet } from "./ExerciseSet";

interface ExerciseListItemProps {
    exercise: IExerciseWorkoutCreate;
    index: number;
    workoutId: string | null;
    onExerciseChange: (exercise: IExerciseWorkoutCreate, index: number) => void;
    onRemoveExercise: (index: number) => void;
    onAddExercise: (index: number, exerciseId: string) => void;    
}

export function ExerciseListItem({ exercise, index, workoutId, onExerciseChange, onRemoveExercise, onAddExercise }: ExerciseListItemProps) {
    const [lastExercise, setLastExercise] = useState<IExerciseWorkout | null>(null);

    useEffect(() => {
        const fetchLastExercise = async () => {
            const exerciseWorkoutService = new ExerciseWorkoutService();
            if (exercise.exerciseId) {
                const response = await exerciseWorkoutService.getLatestExerciseWorkout(exercise.exerciseId, workoutId);
                setLastExercise(response || null);
            }
        };
        fetchLastExercise();
    }, [exercise, index, workoutId]);

    const handleExerciseSelect = async (exerciseId: string) => {
        // Fetch last exercise in the background
        try {
            const exerciseWorkoutService = new ExerciseWorkoutService();
            const response = await exerciseWorkoutService.getLatestExerciseWorkout(exerciseId, workoutId || null);
            setLastExercise(response || null);
        } catch (error) {
            console.error('Error fetching latest exercise:', error);
            setLastExercise(null);
        }

        onAddExercise(index, exerciseId);
    };

    const handleNoteChange = (note: string) => {
        exercise.note = note;
        onExerciseChange(exercise, index);
    };

    const handleAddSet = () => {
        const newSet: IExerciseSetCreate = {
            index: exercise.sets?.length || 0,
            note: ''
        };
        exercise.sets = [...(exercise.sets || []), newSet];
        onExerciseChange(exercise, index);
    };

    const handleSetChange = (setIndex: number, updatedSet: IExerciseSetCreate) => {
        exercise.sets = exercise.sets?.map((set, i) => 
            i === setIndex ? updatedSet : set
        );
        onExerciseChange(exercise, index);
    };


    const handleCopySet = (setIndex: number) => {        
        const setToCopy = exercise.sets?.[setIndex];
        
        if (setToCopy) {
            const newSet: IExerciseSetCreate = {
                ...setToCopy,
                index: setIndex + 1
            };
            
            // Insert the new set after the copied set
            exercise.sets = [
                ...(exercise.sets?.slice(0, setIndex + 1) || []),
                newSet,
                ...(exercise.sets?.slice(setIndex + 1) || [])
            ];
            
            // Update indices
            exercise.sets.forEach((set, i) => {
                set.index = i;
            });
            
            onExerciseChange(exercise, index);
        }
    };

    const handleRemoveSet = (setIndex: number) => {        
        exercise.sets = exercise.sets?.filter((_, i) => i !== setIndex);
        
        // Update indices
        exercise.sets?.forEach((set, i) => {
            set.index = i;
        });
        
        onExerciseChange(exercise, index);
    };

    return (
        <div
            key={index}
            className={cn(
                'p-4 rounded-lg',
                'bg-white dark:bg-slate-800',
                'border border-gray-300 dark:border-gray-700',
                'space-y-4'
            )}
        >
            <div className="flex items-start gap-4">
                {/* Exercise selection */}
                <div className="flex-1">
                    <ExerciseSelect
                        selectedExerciseId={exercise.exerciseId}
                        onExerciseSelect={(exerciseId) => handleExerciseSelect(exerciseId)}
                        required
                    />
                </div>

                {/* Remove button */}
                <button
                    type="button"
                    onClick={() => onRemoveExercise(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Notes field */}
            <div>
                <label htmlFor={`note-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                </label>
                <textarea
                    id={`note-${index}`}
                    value={exercise.note || ''}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    rows={2}
                    className={cn(
                        'mt-1 w-full px-3 py-2 rounded-lg',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white'
                    )}
                />
            </div>
            {lastExercise && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Last workout
                            </span>
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform group-open:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Set
                                        </th>
                                        {lastExercise.exerciseLogType === ExerciseLogType.WeightAndReps && (
                                            <>
                                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Weight
                                                </th>
                                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Reps
                                                </th>
                                            </>
                                        )}
                                        {lastExercise.exerciseLogType === ExerciseLogType.RepsOnly && (
                                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Reps
                                            </th>
                                        )}
                                        {lastExercise.exerciseLogType === ExerciseLogType.TimeOnly && (
                                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Time
                                            </th>
                                        )}
                                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastExercise.sets?.map((set) => (
                                        <ExerciseSet
                                            key={set.id}
                                            set={set}
                                            exerciseType={lastExercise.exerciseLogType}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            )}
            {/* Sets section */}
            {exercise.exerciseId && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sets</h3>
                        <button
                            type="button"
                            onClick={handleAddSet}
                            className={cn(
                                'px-3 py-1 rounded-lg text-sm',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'text-gray-700 dark:text-gray-300',
                                'hover:bg-gray-50 dark:hover:bg-slate-700',
                                'flex items-center gap-1'
                            )}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Set
                        </button>
                    </div>

                    <div className="space-y-2">
                        {exercise.sets?.map((set, setIndex) => (
                            <ExerciseSetEdit
                                key={setIndex}
                                set={set}
                                index={setIndex}
                                exerciseType={ExerciseLogType.WeightAndReps} // TODO: Get from exercise
                                onSetChange={(updatedSet) => handleSetChange(setIndex, updatedSet)}
                                onCopy={() => handleCopySet(setIndex)}
                                onRemove={() => handleRemoveSet(setIndex)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
