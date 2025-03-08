import { IExerciseWorkout } from '@/src/Models/Domain/Workout';
import { ExerciseLogType } from '@/src/Types/Enums';
import { Card } from '@/components/Common/Card';
import { ExerciseSet } from './ExerciseSet';

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
                            {exercise.sets && exercise.sets.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Set
                                                </th>
                                                {exercise.exerciseLogType === ExerciseLogType.WeightAndReps && (
                                                    <>
                                                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            Weight
                                                        </th>
                                                        <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                            Reps
                                                        </th>
                                                    </>
                                                )}
                                                {exercise.exerciseLogType === ExerciseLogType.RepsOnly && (
                                                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Reps
                                                    </th>
                                                )}
                                                {exercise.exerciseLogType === ExerciseLogType.TimeOnly && (
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
                                            {exercise.sets.map((set) => (
                                                <ExerciseSet
                                                    key={set.id}
                                                    set={set}
                                                    exerciseType={exercise.exerciseLogType}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </Card>
            ))}
        </div>
    );
} 