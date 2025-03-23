"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { IExerciseSetCreate } from "@/src/Models/Domain/Workout"
import { ExerciseLogType } from "@/src/Types/Enums"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

interface ExerciseSetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  set: IExerciseSetCreate
  index: number
  exerciseType: ExerciseLogType
  onSave: (set: IExerciseSetCreate) => void
  isNew?: boolean
}

export function ExerciseSetDialog({
  open,
  onOpenChange,
  set,
  index,
  exerciseType,
  onSave,
  isNew = false,
}: ExerciseSetDialogProps) {
  const [localSet, setLocalSet] = useState<IExerciseSetCreate>(set)

  // Update local state when the set prop changes
  useEffect(() => {
    setLocalSet(set)
  }, [set])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = e.target.value ? Number(e.target.value) : undefined
    setLocalSet({ ...localSet, weight })
  }

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reps = e.target.value ? Number(e.target.value) : undefined
    setLocalSet({ ...localSet, reps })
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value ? Number(e.target.value) : undefined
    setLocalSet({ ...localSet, time })
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const note = e.target.value
    setLocalSet({ ...localSet, note })
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    onSave(localSet)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black dark:bg-slate-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Set" : `Edit Set ${index + 1}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            {exerciseType === ExerciseLogType.WeightAndReps && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      name="reps"
                      type="number"
                      inputMode="numeric"
                      value={localSet.reps || ""}
                      onChange={handleRepsChange}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      inputMode="decimal"
                      value={localSet.weight || ""}
                      onChange={handleWeightChange}
                      className="h-10"
                    />
                  </div>
                </div>
              </>
            )}

            {exerciseType === ExerciseLogType.RepsOnly && (
              <div className="space-y-2">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  name="reps"
                  type="number"
                  inputMode="numeric"
                  value={localSet.reps || ""}
                  onChange={handleRepsChange}
                  className="h-10"
                />
              </div>
            )}

            {exerciseType === ExerciseLogType.TimeOnly && (
              <div className="space-y-2">
                <Label htmlFor="time">Time (seconds)</Label>
                <Input
                  id="time"
                  name="time"
                  type="number"
                  inputMode="numeric"
                  value={localSet.time || ""}
                  onChange={handleTimeChange}
                  className="h-10"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="note">Notes</Label>
              <Input id="note" name="note" value={localSet.note || ""} onChange={handleNoteChange} className="h-10" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

