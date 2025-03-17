import { IExerciseWorkout } from "@/src/Models/Domain/Workout";
import { ExerciseSet } from "./ExerciseSet";
import { ExerciseLogType } from "@/src/Types/Enums";

interface ExerciseSetsProps {
    exercise: IExerciseWorkout;
}

export function ExerciseSets({ exercise }: ExerciseSetsProps) {

    if (!exercise.sets || exercise.sets.length === 0) {
        return null;
    }

    return (        
        <table className="w-full">
            <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                        Set
                    </th>
                    {exercise.exerciseLogType === ExerciseLogType.WeightAndReps && (
                        <>                            
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                Reps
                            </th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                Weight
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
                {exercise.sets.sort((a, b) => a.index - b.index).map((set) => (
                    <ExerciseSet
                        key={set.id}
                        set={set}
                        exerciseType={exercise.exerciseLogType}
                    />
                ))}
            </tbody>
        </table>
    )
}
