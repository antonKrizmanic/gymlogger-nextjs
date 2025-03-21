import { cn } from '@/src/lib/utils';
import { IExerciseWorkoutCreate } from '@/src/Models/Domain/Workout';
import { ExerciseListItem } from './ExerciseListItem';
import { PlusIcon } from '../Icons';
import { Button } from '../ui/button';

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
        <div className="space-y-4">
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
            <Button
                type="button"
                onClick={handleAddExercise}                
            >
                <PlusIcon />
                Add Exercise
            </Button>
        </div>
    );
} 