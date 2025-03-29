"use client"

import type React from "react"

import { Copy, X } from "lucide-react"
import type { IExerciseSetCreate } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"

interface ExerciseSetEditProps {
  set: IExerciseSetCreate
  index: number
  exerciseType: ExerciseLogType
  onSetChange: (updatedSet: IExerciseSetCreate) => void
  onCopy: () => void
  onRemove: () => void
}

export function ExerciseSetEdit({ set, index, exerciseType, onSetChange, onCopy, onRemove }: ExerciseSetEditProps) {
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = e.target.value ? Number(e.target.value) : undefined
    onSetChange({ ...set, weight })
  }

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reps = e.target.value ? Number(e.target.value) : undefined
    onSetChange({ ...set, reps })
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value ? Number(e.target.value) : undefined
    onSetChange({ ...set, time })
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const note = e.target.value
    onSetChange({ ...set, note })
  }

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg bg-muted">
      <span className="text-sm font-medium w-8 text-center">{index + 1}</span>

      {exerciseType === ExerciseLogType.WeightAndReps && (
        <>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Reps"
              value={set.reps || ""}
              onChange={handleRepsChange}
              className="h-9"
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Weight"
              value={set.weight || ""}
              onChange={handleWeightChange}
              className="h-9"
            />
          </div>
        </>
      )}

      {exerciseType === ExerciseLogType.RepsOnly && (
        <div className="flex-1">
          <Input type="number" placeholder="Reps" value={set.reps || ""} onChange={handleRepsChange} className="h-9" />
        </div>
      )}

      {exerciseType === ExerciseLogType.TimeOnly && (
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Time (s)"
            value={set.time || ""}
            onChange={handleTimeChange}
            className="h-9"
          />
        </div>
      )}

      <div className="flex-1">
        <Input placeholder="Notes" value={set.note || ""} onChange={handleNoteChange} className="h-9" />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onCopy}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy set</span>
        </Button>
        <Button
          type="button"
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove set</span>
        </Button>
      </div>
    </div>
  )
}

