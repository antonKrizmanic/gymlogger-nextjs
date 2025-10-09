"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/src/components/ui/button"
import { IconInput } from "@/src/components/ui/icon-input"
import type { IExerciseSetCreate } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"
import { Clock, Hash, StickyNote, Weight } from "lucide-react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer"

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
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalSet(set)
  }, [set])

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const weight = event.target.value ? Number(event.target.value) : undefined
    setLocalSet({ ...localSet, weight })
  }

  const handleRepsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reps = event.target.value ? Number(event.target.value) : undefined
    setLocalSet({ ...localSet, reps })
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value ? Number(event.target.value) : undefined
    setLocalSet({ ...localSet, time })
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const note = event.target.value
    setLocalSet({ ...localSet, note })
  }

  const handleSave = () => {
    onSave(localSet)
  }

  const title = isNew ? "Add set" : `Edit set ${index + 1}`

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-t border-border bg-card/95">
        <DrawerHeader className="gap-2 px-6 pt-6 text-left">
          <DrawerTitle className="type-heading-xs">{title}</DrawerTitle>
          <DrawerDescription>
            Capture reps, load, time, and notes exactly as you would on desktop. Changes are applied when you confirm.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6">
          <SetForm
            exerciseType={exerciseType}
            localSet={localSet}
            firstFieldRef={firstFieldRef}
            handleWeightChange={handleWeightChange}
            handleRepsChange={handleRepsChange}
            handleTimeChange={handleTimeChange}
            handleNoteChange={handleNoteChange}
          />
        </div>

        <DrawerFooter className="space-y-3 border-t border-border/60 bg-muted/50 px-6 py-5">
          <Button type="button" onClick={handleSave} className="h-11 gap-2">
            {isNew ? "Add set" : "Save changes"}
          </Button>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 border-2"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface SetFormProps {
  exerciseType: ExerciseLogType
  localSet: IExerciseSetCreate
  firstFieldRef: React.MutableRefObject<HTMLInputElement | null>
  handleWeightChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRepsChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleNoteChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function SetForm({
  exerciseType,
  localSet,
  firstFieldRef,
  handleWeightChange,
  handleRepsChange,
  handleTimeChange,
  handleNoteChange,
}: SetFormProps) {
  return (
    <div className="grid gap-5 py-6">
      {exerciseType === ExerciseLogType.WeightAndReps && (
        <div className="grid grid-cols-1 gap-4">
          <IconInput
            icon={Hash}
            label="Repetitions"
            id="reps"
            name="reps"
            type="number"
            inputMode="numeric"
            value={localSet.reps || ""}
            onChange={handleRepsChange}
            placeholder="0"
            ref={firstFieldRef}
            size="comfortable"
          />
          <IconInput
            icon={Weight}
            label="Weight (kg)"
            id="weight"
            name="weight"
            type="number"
            value={localSet.weight || ""}
            onChange={handleWeightChange}
            placeholder="0"
            size="comfortable"
          />
        </div>
      )}

      {exerciseType === ExerciseLogType.BodyWeight && (
        <>
          <IconInput
            icon={Hash}
            label="Repetitions"
            id="reps"
            name="reps"
            type="number"
            inputMode="numeric"
            value={localSet.reps || ""}
            onChange={handleRepsChange}
            placeholder="0"
            ref={firstFieldRef}
            size="comfortable"
          />
          <p className="type-helper text-muted-foreground">
            Body weight is included automatically when calculating total load.
          </p>
        </>
      )}

      {exerciseType === ExerciseLogType.BodyWeightWithAdditionalWeight && (
        <>
          <div className="grid grid-cols-1 gap-4">
            <IconInput
              icon={Hash}
              label="Repetitions"
              id="reps"
              name="reps"
              type="number"
              inputMode="numeric"
              value={localSet.reps || ""}
              onChange={handleRepsChange}
              placeholder="0"
              ref={firstFieldRef}
              size="comfortable"
            />
            <IconInput
              icon={Weight}
              label="Additional weight (kg)"
              id="weight"
              name="weight"
              type="number"
              value={localSet.weight || ""}
              onChange={handleWeightChange}
              placeholder="0"
              size="comfortable"
            />
          </div>
          <p className="type-helper text-muted-foreground">
            Your body weight will be added to this extra load when summarizing the set.
          </p>
        </>
      )}

      {exerciseType === ExerciseLogType.BodyWeightWithAssistance && (
        <>
          <div className="grid grid-cols-1 gap-4">
            <IconInput
              icon={Hash}
              label="Repetitions"
              id="reps"
              name="reps"
              type="number"
              inputMode="numeric"
              value={localSet.reps || ""}
              onChange={handleRepsChange}
              placeholder="0"
              ref={firstFieldRef}
              size="comfortable"
            />
            <IconInput
              icon={Weight}
              label="Assistance (kg)"
              id="weight"
              name="weight"
              type="number"
              value={localSet.weight || ""}
              onChange={handleWeightChange}
              placeholder="0"
              size="comfortable"
            />
          </div>
          <p className="type-helper text-muted-foreground">
            Assistance load will be subtracted from your body weight in total calculations.
          </p>
        </>
      )}

      {exerciseType === ExerciseLogType.RepsOnly && (
        <IconInput
          icon={Hash}
          label="Repetitions"
          id="reps"
          name="reps"
          type="number"
          inputMode="numeric"
          value={localSet.reps || ""}
          onChange={handleRepsChange}
          placeholder="0"
          ref={firstFieldRef}
          size="comfortable"
        />
      )}

      {exerciseType === ExerciseLogType.TimeOnly && (
        <IconInput
          icon={Clock}
          label="Time (seconds)"
          id="time"
          name="time"
          type="number"
          inputMode="numeric"
          value={localSet.time || ""}
          onChange={handleTimeChange}
          placeholder="0"
          ref={firstFieldRef}
          size="comfortable"
        />
      )}

      <IconInput
        icon={StickyNote}
        label="Set notes"
        id="note"
        name="note"
        value={localSet.note || ""}
        onChange={handleNoteChange}
        placeholder="Add cues or adjustments for this set"
        size="comfortable"
      />
    </div>
  )
}
