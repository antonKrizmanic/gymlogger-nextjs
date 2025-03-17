import { IExerciseSet } from '@/src/Models/Domain/Workout';
import { ExerciseLogType } from '@/src/Types/Enums';

interface ExerciseSetProps {
    set: IExerciseSet;
    exerciseType: ExerciseLogType;
}

export function ExerciseSet({ set, exerciseType }: ExerciseSetProps) {
    return (
        <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="py-2 px-4 text-sm text-gray-500 dark:text-gray-400">
                {set.index + 1}
            </td>
            {exerciseType === ExerciseLogType.WeightAndReps && (
                <>                    
                    <td className="py-2 px-4 text-sm text-gray-900 dark:text-white">
                        {set.reps}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-900 dark:text-white">
                        {set.weight} kg
                    </td>
                </>
            )}
            {exerciseType === ExerciseLogType.RepsOnly && (
                <td className="py-2 px-4 text-sm text-gray-900 dark:text-white">
                    {set.reps}
                </td>
            )}
            {exerciseType === ExerciseLogType.TimeOnly && (
                <td className="py-2 px-4 text-sm text-gray-900 dark:text-white">
                    {set.time}s
                </td>
            )}
            {set.note && (
                <td className="py-2 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {set.note}
                </td>
            )}
        </tr>
    );
} 