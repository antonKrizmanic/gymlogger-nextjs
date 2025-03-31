"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { IExerciseSetCreate } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer"

interface ExerciseSetDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  set: IExerciseSetCreate
  index: number
  exerciseType: ExerciseLogType
  onSave: (set: IExerciseSetCreate) => void
  isNew?: boolean
}

export function ExerciseSetDrawer({
  open,
  onOpenChange,
  set,
  index,
  exerciseType,
  onSave,
  isNew = false,
}: ExerciseSetDrawerProps) {
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

  const handleSave = () => {
    onSave(localSet)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white text-black dark:bg-slate-900 dark:text-white">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-black dark:text-white">{isNew ? "Add New Set" : `Edit Set ${index + 1}`}</DrawerTitle>
        </DrawerHeader>
        <SetForm
          exerciseType={exerciseType}
          localSet={localSet}
          handleWeightChange={handleWeightChange}
          handleRepsChange={handleRepsChange}
          handleTimeChange={handleTimeChange}
          handleNoteChange={handleNoteChange} />
        <DrawerFooter className="pt-2">          
          <Button type="button" onClick={handleSave}>Save</Button>
          <DrawerClose asChild>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

}

interface SetFormProps {
  exerciseType: ExerciseLogType,
  localSet: IExerciseSetCreate,
  handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleRepsChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleNoteChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

function SetForm({ exerciseType, localSet, handleWeightChange, handleRepsChange, handleTimeChange, handleNoteChange }: SetFormProps) {
  return (
    <div className="grid gap-4 px-4">
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
  )
}