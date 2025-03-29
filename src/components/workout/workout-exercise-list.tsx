import { IExerciseWorkout } from '@/src/models/domain/workout';
import { Card, CardContent } from '@/src/components/ui/card';
import { ExerciseSets } from './exercise-sets';

interface WorkoutExerciseListProps {
    exercises: IExerciseWorkout[];
}

export function WorkoutExerciseList({ exercises }: WorkoutExerciseListProps) {
    return (
        <div className="space-y-4">
            {exercises.map((exercise) => (
                <Card key={exercise.exerciseId}>
                    <CardContent>
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
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 