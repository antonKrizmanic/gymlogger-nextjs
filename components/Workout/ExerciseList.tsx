import { cn } from '@/lib/utils';
import { IExerciseWorkoutCreate } from '@/src/Models/Domain/Workout';
import { ExerciseListItem } from './ExerciseListItem';

interface ExerciseListProps {
    exercises: IExerciseWorkoutCreate[];
    onExercisesChange: (exercises: IExerciseWorkoutCreate[]) => void;
    workoutId: string | null;
}

export function ExerciseList({ exercises, onExercisesChange, workoutId }: ExerciseListProps) {
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

    const handleExerciseSelect = async (index: number, exerciseId: string) => {
        // Update the exercise ID
        const updatedExercises = [...exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            exerciseId,
            sets: []
        };
        onExercisesChange(updatedExercises);
    };
    

    const onExerciseChange = (exercise: IExerciseWorkoutCreate, index: number) => {
        const updatedExercises = [...exercises];
        updatedExercises[index] = exercise;
        onExercisesChange(updatedExercises);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exercises</h2>
            
            {exercises.map((exercise, index) => (
                <ExerciseListItem 
                    key={index} 
                    exercise={exercise} 
                    index={index} 
                    onExerciseChange={onExerciseChange} 
                    onRemoveExercise={handleRemoveExercise}
                    onAddExercise={handleExerciseSelect}
                    workoutId={workoutId}
                />
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