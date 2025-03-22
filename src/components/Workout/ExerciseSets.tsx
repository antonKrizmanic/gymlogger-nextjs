import type { IExerciseWorkout } from "@/src/Models/Domain/Workout"
import { ExerciseSet } from "./ExerciseSet"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { ExerciseLogType } from "@/src/Types/Enums"

interface ExerciseSetsProps {
  exercise: IExerciseWorkout
}

export function ExerciseSets({ exercise }: ExerciseSetsProps) {
  if (!exercise.sets || exercise.sets.length === 0) {
    return <p className="text-sm text-muted-foreground">No sets recorded</p>
  }

  const exerciseType = exercise.exerciseLogType || ExerciseLogType.WeightAndReps

  return (
    <Table>
      <TableHeader>
        <TableRow >
          <TableHead className="w-[60px] text-gray-500 dark:text-white">Set</TableHead>

          {exerciseType === ExerciseLogType.WeightAndReps && (
            <>
              <TableHead className="text-gray-500 dark:text-white">Reps</TableHead>
              <TableHead className="text-gray-500 dark:text-white">Weight</TableHead>
            </>
          )}

          {exerciseType === ExerciseLogType.RepsOnly && <TableHead className="text-gray-500 dark:text-white">Reps</TableHead>}

          {exerciseType === ExerciseLogType.TimeOnly && <TableHead className="text-gray-500 dark:text-white">Time</TableHead>}

          <TableHead className="text-gray-500 dark:text-white">Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercise.sets.map((set) => (
          <ExerciseSet key={set.index} set={set} exerciseType={exerciseType} />
        ))}
      </TableBody>
    </Table>
  )
}

