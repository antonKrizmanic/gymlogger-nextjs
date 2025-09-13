import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import type { IExerciseWorkout } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"
import { Activity } from "lucide-react"
import { ExerciseSet } from "./exercise-set"

interface ExerciseSetsProps {
  exercise: IExerciseWorkout
}

export function ExerciseSets({ exercise }: ExerciseSetsProps) {
  if (!exercise.sets || exercise.sets.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-muted/50 rounded-full">
            <Activity className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">No Sets Recorded</p>
            <p className="text-xs text-muted-foreground">
              This exercise doesn&apos;t have any sets logged yet.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const exerciseType = exercise.exerciseLogType || ExerciseLogType.WeightAndReps

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-muted hover:bg-transparent">
            <TableHead className="w-[60px] text-muted-foreground font-semibold">Set</TableHead>

            {exerciseType === ExerciseLogType.WeightAndReps && (
              <>
                <TableHead className="text-muted-foreground font-semibold">Reps</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Weight</TableHead>
              </>
            )}

            {exerciseType === ExerciseLogType.RepsOnly && (
              <TableHead className="text-muted-foreground font-semibold">Reps</TableHead>
            )}

            {exerciseType === ExerciseLogType.TimeOnly && (
              <TableHead className="text-muted-foreground font-semibold">Time</TableHead>
            )}

            <TableHead className="text-muted-foreground font-semibold">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercise.sets.map((set) => (
            <ExerciseSet key={set.index} set={set} exerciseType={exerciseType} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

