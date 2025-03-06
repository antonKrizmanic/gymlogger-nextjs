import { ExerciseSelect } from './ExerciseSelect';
import { ExerciseSet } from './ExerciseSet';
import { cn } from '@/lib/utils';
import { IExerciseWorkoutCreate, IExerciseSetCreate } from '@/src/Models/Domain/Workout';
import { ExerciseLogType } from '@/src/Types/Enums';

interface ExerciseListProps {
    exercises: IExerciseWorkoutCreate[];
    onExercisesChange: (exercises: IExerciseWorkoutCreate[]) => void;
}

export function ExerciseList({ exercises, onExercisesChange }: ExerciseListProps) {
    const handleAddExercise = () => {
        const newExercise: IExerciseWorkoutCreate = {
            exerciseId: '',
            index: exercises.length,
            note: '',
            sets: []
        };
        onExercisesChange([...exercises, newExercise]);
    };

    const handleRemoveExercise = (index: number) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        // Update indices
        updatedExercises.forEach((exercise, i) => {
            exercise.index = i;
        });
        onExercisesChange(updatedExercises);
    };

    const handleExerciseSelect = (index: number, exerciseId: string) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            exerciseId,
            sets: [] // Reset sets when exercise changes
        };
        onExercisesChange(updatedExercises);
    };

    const handleNoteChange = (index: number, note: string) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            note
        };
        onExercisesChange(updatedExercises);
    };

    const handleAddSet = (exerciseIndex: number) => {
        const updatedExercises = [...exercises];
        const exercise = updatedExercises[exerciseIndex];
        const newSet: IExerciseSetCreate = {
            index: exercise.sets?.length || 0,
            note: ''
        };
        exercise.sets = [...(exercise.sets || []), newSet];
        onExercisesChange(updatedExercises);
    };

    const handleSetChange = (exerciseIndex: number, setIndex: number, updatedSet: IExerciseSetCreate) => {
        const updatedExercises = [...exercises];
        const exercise = updatedExercises[exerciseIndex];
        exercise.sets = exercise.sets?.map((set, i) => 
            i === setIndex ? updatedSet : set
        );
        onExercisesChange(updatedExercises);
    };

    const handleCopySet = (exerciseIndex: number, setIndex: number) => {
        const updatedExercises = [...exercises];
        const exercise = updatedExercises[exerciseIndex];
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
            
            onExercisesChange(updatedExercises);
        }
    };

    const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
        const updatedExercises = [...exercises];
        const exercise = updatedExercises[exerciseIndex];
        exercise.sets = exercise.sets?.filter((_, i) => i !== setIndex);
        
        // Update indices
        exercise.sets?.forEach((set, i) => {
            set.index = i;
        });
        
        onExercisesChange(updatedExercises);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exercises</h2>
            
            {exercises.map((exercise, index) => (
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
                                onExerciseSelect={(exerciseId) => handleExerciseSelect(index, exerciseId)}
                                required
                            />
                        </div>

                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={() => handleRemoveExercise(index)}
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
                            onChange={(e) => handleNoteChange(index, e.target.value)}
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

                    {/* Sets section */}
                    {exercise.exerciseId && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sets</h3>
                                <button
                                    type="button"
                                    onClick={() => handleAddSet(index)}
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
                                    <ExerciseSet
                                        key={setIndex}
                                        set={set}
                                        index={setIndex}
                                        exerciseType={ExerciseLogType.WeightAndReps} // TODO: Get from exercise
                                        onSetChange={(updatedSet) => handleSetChange(index, setIndex, updatedSet)}
                                        onCopy={() => handleCopySet(index, setIndex)}
                                        onRemove={() => handleRemoveSet(index, setIndex)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Add Exercise button */}
            <button
                type="button"
                onClick={handleAddExercise}
                className={cn(
                    'w-full px-4 py-2 rounded-lg',
                    'bg-white dark:bg-slate-800',
                    'border border-gray-300 dark:border-gray-700',
                    'text-gray-700 dark:text-gray-300',
                    'hover:bg-gray-50 dark:hover:bg-slate-700',
                    'flex items-center justify-center gap-2'
                )}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Exercise
            </button>
        </div>
    );
} 