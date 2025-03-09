import { IExerciseWorkout } from '@/src/Models/Domain/Workout';
import { Card } from '@/components/Common/Card';
import { ExerciseSets } from './ExerciseSets';

interface WorkoutExerciseListProps {
    exercises: IExerciseWorkout[];
}

export function WorkoutExerciseList({ exercises }: WorkoutExerciseListProps) {
    return (
        <div className="space-y-4">
            {exercises.map((exercise) => (
                <Card key={exercise.exerciseId}>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{exercise.exerciseName}</h3>
                            {exercise.note && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {exercise.note}
                                </p>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <ExerciseSets exercise={exercise} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
} 