"use client"

import type React from "react"

import { Button } from "@/src/components/ui/button"
import { IconInput } from "@/src/components/ui/icon-input"
import type { IExerciseSetCreate } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"
import { Clock, Copy, Hash, StickyNote, Weight, X } from "lucide-react"

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
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-muted/80 to-muted/40 border border-muted-foreground/10 shadow-card-rest">
      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
        <span className="text-sm font-bold text-primary">{index + 1}</span>
      </div>

      {exerciseType === ExerciseLogType.WeightAndReps && (
        <>
          <div className="flex-1">
            <IconInput
              icon={Hash}
              label="Reps"
              type="number"
              placeholder="0"
              value={set.reps || ""}
              onChange={handleRepsChange}
            />
          </div>
          <div className="flex-1">
            <IconInput
              icon={Weight}
              label="Weight (kg)"
              type="number"
              placeholder="0"
              value={set.weight || ""}
              onChange={handleWeightChange}
            />
          </div>
        </>
      )}

      {exerciseType === ExerciseLogType.BodyWeight && (
        <div className="flex-1">
          <IconInput
            icon={Hash}
            label="Reps"
            type="number"
            placeholder="0"
            value={set.reps || ""}
            onChange={handleRepsChange}
          />
        </div>
      )}

      {exerciseType === ExerciseLogType.BodyWeightWithAdditionalWeight && (
        <>
          <div className="flex-1">
            <IconInput
              icon={Hash}
              label="Reps"
              type="number"
              placeholder="0"
              value={set.reps || ""}
              onChange={handleRepsChange}
            />
          </div>
          <div className="flex-1">
            <IconInput
              icon={Weight}
              label="Additional Weight (kg)"
              type="number"
              placeholder="0"
              value={set.weight || ""}
              onChange={handleWeightChange}
            />
          </div>
        </>
      )}

      {exerciseType === ExerciseLogType.BodyWeightWithAssistance && (
        <>
          <div className="flex-1">
            <IconInput
              icon={Hash}
              label="Reps"
              type="number"
              placeholder="0"
              value={set.reps || ""}
              onChange={handleRepsChange}
            />
          </div>
          <div className="flex-1">
            <IconInput
              icon={Weight}
              label="Assistance Weight (kg)"
              type="number"
              placeholder="0"
              value={set.weight || ""}
              onChange={handleWeightChange}
            />
          </div>
        </>
      )}

      {exerciseType === ExerciseLogType.RepsOnly && (
        <div className="flex-1">
          <IconInput
            icon={Hash}
            label="Reps"
            type="number"
            placeholder="0"
            value={set.reps || ""}
            onChange={handleRepsChange}
          />
        </div>
      )}

      {exerciseType === ExerciseLogType.TimeOnly && (
        <div className="flex-1">
          <IconInput
            icon={Clock}
            label="Time (seconds)"
            type="number"
            placeholder="0"
            value={set.time || ""}
            onChange={handleTimeChange}
          />
        </div>
      )}

      <div className="flex-1">
        <IconInput
          icon={StickyNote}
          label="Set notes"
          placeholder="Add notes for this set..."
          value={set.note || ""}
          onChange={handleNoteChange}
        />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          type="button"
          onClick={onCopy}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy set</span>
        </Button>
        <Button
          type="button"
          onClick={onRemove}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove set</span>
        </Button>
      </div>
    </div>
  )
}

