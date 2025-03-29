import type { IExerciseSet } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"
import { TableCell, TableRow } from "@/src/components/ui/table"

interface ExerciseSetProps {
  set: IExerciseSet
  exerciseType: ExerciseLogType
}

export function ExerciseSet({ set, exerciseType }: ExerciseSetProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{set.index + 1}</TableCell>

      {exerciseType === ExerciseLogType.WeightAndReps && (
        <>
          <TableCell>{set.reps}</TableCell>
          <TableCell>{set.weight} kg</TableCell>
        </>
      )}

      {exerciseType === ExerciseLogType.RepsOnly && <TableCell>{set.reps}</TableCell>}

      {exerciseType === ExerciseLogType.TimeOnly && <TableCell>{set.time}s</TableCell>}

      <TableCell className="text-muted-foreground">{set.note || "-"}</TableCell>
    </TableRow>
  )
}

