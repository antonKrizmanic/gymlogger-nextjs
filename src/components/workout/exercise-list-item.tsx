"use client"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { format } from "date-fns"
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Info,
  Pencil,
  PlusCircle,
  StickyNote,
  X,
} from "lucide-react"

import { ExerciseApiService } from "@/src/api/services/exercise-api-service"
import { ExerciseApiWorkoutService } from "@/src/api/services/exercise-workout-api-service"
import type { IExercise } from "@/src/models/domain/exercise"
import type { IExerciseSetCreate, IExerciseWorkout, IExerciseWorkoutCreate } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"

import { CollapsibleNote } from "@/src/components/common/collapsible-note"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { cn } from "@/src/lib/utils"
import { ExerciseSelect } from "./exercise-select"
import { ExerciseSetDrawer } from "./exercise-set-drawer"
import { ExerciseSetEdit } from "./exercise-set-edit"
import { ExerciseSets } from "./exercise-sets"

interface ExerciseListItemProps {
  exercise: IExerciseWorkoutCreate
  index: number
  workoutId: string | null
  onExerciseChange: (exercise: IExerciseWorkoutCreate, index: number) => void
  onRemoveExercise: (index: number) => void
  onAddExercise: (index: number, exerciseId: string) => void
  isExpanded: boolean
  onToggle: (open: boolean) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export const ExerciseListItem = memo(function ExerciseListItem({
  exercise,
  index,
  workoutId,
  onExerciseChange,
  onRemoveExercise,
  onAddExercise,
  isExpanded,
  onToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ExerciseListItemProps) {
  const [lastExercise, setLastExercise] = useState<IExerciseWorkout | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(null)
  const [isLastWorkoutOpen, setIsLastWorkoutOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentSetIndex, setCurrentSetIndex] = useState<number | null>(null)
  // CollapsibleNote manages notes UI state internally

  useEffect(() => {
    const fetchExerciseData = async () => {
      if (!exercise.exerciseId) return

      try {
        // Fetch the exercise details
        const exerciseService = new ExerciseApiService()
        const exerciseResponse = await exerciseService.getExercise(exercise.exerciseId)
        setSelectedExercise(exerciseResponse || null)

        // Fetch the last exercise workout
        const exerciseWorkoutService = new ExerciseApiWorkoutService()
        const lastWorkoutResponse = await exerciseWorkoutService.getLatestExerciseWorkout(
          exercise.exerciseId,
          workoutId,
        )
        setLastExercise(lastWorkoutResponse || null)
      } catch (error) {
        console.error("Error fetching exercise data:", error)
        setLastExercise(null)
        setSelectedExercise(null)
      }
    }

    fetchExerciseData()
  }, [exercise.exerciseId, workoutId])

  // Don't auto-expand notes - let user decide

  const handleExerciseSelect = useCallback(async (exerciseId: string) => {
    // Let the parent component know about the change
    onAddExercise(index, exerciseId)
  }, [onAddExercise, index])

  const handleNoteValueChange = useCallback((value: string) => {
    onExerciseChange({ ...exercise, note: value }, index)
  }, [exercise, index, onExerciseChange])

  // Legacy note handlers removed in favor of CollapsibleNote

  const handleAddSet = useCallback(() => {
    // For mobile, open the dialog with a new set
    if (window.innerWidth < 768) {
      // Create a temporary set for the dialog
      setCurrentSetIndex(null) // null indicates a new set

      // Open the dialog with a new empty set
      setIsDialogOpen(true)
    } else {
      // For desktop, add the set directly as before
      const newSet: IExerciseSetCreate = {
        index: exercise.sets?.length || 0,
        note: "",
      }
      const updatedExercise = { ...exercise, sets: [...(exercise.sets || []), newSet] }
      onExerciseChange(updatedExercise, index)
    }
  }, [exercise, index, onExerciseChange])

  const handleEditSet = useCallback((setIndex: number) => {
    setCurrentSetIndex(setIndex)
    setIsDialogOpen(true)
  }, [])

  const handleSetChange = useCallback((setIndex: number, updatedSet: IExerciseSetCreate) => {
    const updatedSets = exercise.sets?.map((set, i) => (i === setIndex ? updatedSet : set))
    const updatedExercise = { ...exercise, sets: updatedSets }
    onExerciseChange(updatedExercise, index)
  }, [exercise, index, onExerciseChange])

  const handleDialogSave = useCallback((updatedSet: IExerciseSetCreate) => {
    let updatedSets: IExerciseSetCreate[]

    if (currentSetIndex === null) {
      // Adding a new set
      const newSet = {
        ...updatedSet,
        index: exercise.sets?.length || 0,
      }
      updatedSets = [...(exercise.sets || []), newSet]
    } else {
      // Updating an existing set
      updatedSets = exercise.sets?.map((set, i) => (i === currentSetIndex ? updatedSet : set)) || []
    }

    // Update indices to ensure they're sequential
    updatedSets.forEach((set, i) => {
      set.index = i
    })

    const updatedExercise = { ...exercise, sets: updatedSets }
    onExerciseChange(updatedExercise, index)
    setIsDialogOpen(false)
  }, [currentSetIndex, exercise, index, onExerciseChange])

  const handleCopySet = useCallback((setIndex: number) => {
    const setToCopy = exercise.sets?.[setIndex]

    if (setToCopy) {
      const newSet: IExerciseSetCreate = {
        ...setToCopy,
        index: exercise.sets?.length || 0,
      }

      // Add the new set at the end
      const updatedSets = [...(exercise.sets || []), newSet]

      // Update indices
      updatedSets.forEach((set, i) => {
        set.index = i
      })

      const updatedExercise = { ...exercise, sets: updatedSets }
      onExerciseChange(updatedExercise, index)
    }
  }, [exercise, index, onExerciseChange])

  const handleRemoveSet = useCallback((setIndex: number) => {
    const updatedSets = exercise.sets?.filter((_, i) => i !== setIndex) || []

    // Update indices
    updatedSets.forEach((set, i) => {
      set.index = i
    })

    const updatedExercise = { ...exercise, sets: updatedSets }
    onExerciseChange(updatedExercise, index)
  }, [exercise, index, onExerciseChange])

  // Get the exercise type for the sets - memoized for performance
  const exerciseLogType = useMemo(() =>
    selectedExercise?.exerciseLogType || ExerciseLogType.WeightAndReps,
    [selectedExercise?.exerciseLogType]
  )

  // Get the current set for the dialog - memoized for performance
  const currentSet = useMemo(() =>
    currentSetIndex !== null && exercise.sets
      ? exercise.sets[currentSetIndex]
      : { index: exercise.sets?.length || 0, note: "" },
    [currentSetIndex, exercise.sets]
  )

  // Memoize exercise display properties
  const exerciseDisplayProps = useMemo(() => ({
    hasDescription: Boolean(selectedExercise?.description),
    description: selectedExercise?.description,
    hasSets: Boolean(exercise.sets?.length),
    setsCount: exercise.sets?.length || 0,
  }), [selectedExercise?.description, exercise.sets?.length])

  const exerciseTypeLabel = useMemo(() => {
    switch (exerciseLogType) {
      case ExerciseLogType.WeightAndReps:
        return "Weight + reps"
      case ExerciseLogType.BodyWeight:
        return "Bodyweight"
      case ExerciseLogType.BodyWeightWithAdditionalWeight:
        return "Bodyweight + load"
      case ExerciseLogType.BodyWeightWithAssistance:
        return "Bodyweight + assist"
      case ExerciseLogType.RepsOnly:
        return "Reps"
      case ExerciseLogType.TimeOnly:
        return "Time"
      default:
        return "Sets"
    }
  }, [exerciseLogType])

  const lastWorkoutDate = useMemo(() => {
    if (!lastExercise?.workoutDate) {
      return null
    }
    try {
      return format(new Date(lastExercise.workoutDate), "PPP")
    } catch {
      return null
    }
  }, [lastExercise?.workoutDate])

  const setsBadgeLabel = `${exerciseDisplayProps.setsCount || 0} set${exerciseDisplayProps.setsCount === 1 ? "" : "s"}`

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className={cn("flex flex-col", isExpanded ? "bg-card/95" : "bg-card")}>
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <span className="mt-2 text-muted-foreground/80">
                  <GripVertical className="size-5" aria-hidden />
                  <span className="sr-only">Drag to reorder exercise {index + 1}</span>
                </span>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="type-label text-muted-foreground">Exercise</p>
                    <div className="flex items-center gap-2">
                      <p className="truncate text-base font-semibold text-foreground">
                        {selectedExercise?.name || "Select an exercise"}
                      </p>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 transition-transform",
                          isExpanded ? "rotate-180" : "rotate-0",
                        )}
                        aria-hidden
                      />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:text-foreground"
                onClick={onMoveUp}
                disabled={isFirst}
              >
                <ChevronUp className="size-4" aria-hidden />
                <span className="sr-only">Move exercise up</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:text-foreground"
                onClick={onMoveDown}
                disabled={isLast}
              >
                <ChevronDown className="size-4" aria-hidden />
                <span className="sr-only">Move exercise down</span>
              </Button>
              <Button
                type="button"
                onClick={() => onRemoveExercise(index)}
                variant="ghost"
                size="icon"
                className="size-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-4" aria-hidden />
                <span className="sr-only">Remove exercise</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {exerciseTypeLabel}
            </Badge>
            <Badge variant="outline">{setsBadgeLabel}</Badge>
            {selectedExercise?.muscleGroupName ? (
              <Badge variant="outline" className="capitalize">
                {selectedExercise.muscleGroupName.toLowerCase()}
              </Badge>
            ) : null}
            {lastWorkoutDate ? (
              <Badge variant="outline" className="gap-1">
                <Info className="size-3.5" aria-hidden />
                Last: {lastWorkoutDate}
              </Badge>
            ) : null}
          </div>
        </div>

        <CollapsibleContent className="border-t border-border/60">
          <div className="space-y-6 p-4 sm:p-6">
            <div className="w-full">
              <ExerciseSelect
                selectedExerciseId={exercise.exerciseId}
                onExerciseSelect={(exerciseId) => handleExerciseSelect(exerciseId)}
                required
              />
            </div>

            {exerciseDisplayProps.hasDescription && (
              <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
                <p className="type-helper text-muted-foreground">{exerciseDisplayProps.description}</p>
              </div>
            )}

            <CollapsibleNote
              label="Exercise notes"
              value={exercise.note || ""}
              onChange={handleNoteValueChange}
              icon={StickyNote}
              placeholder="Add cues, warm-up details, or modifications..."
            />

            {lastExercise && (
              <Collapsible open={isLastWorkoutOpen} onOpenChange={setIsLastWorkoutOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="group flex w-full items-center justify-between px-3 py-2">
                    <span className="type-label">Last workout details</span>
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform group-data-[state=open]:rotate-180",
                        isLastWorkoutOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <ExerciseSets exercise={lastExercise} />
                </CollapsibleContent>
              </Collapsible>
            )}

            {exercise.exerciseId && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="type-label text-muted-foreground">Sets</h3>
                  <Button type="button" onClick={handleAddSet} size="sm" className="gap-2">
                    <PlusCircle className="size-4" aria-hidden />
                    Add set
                  </Button>
                </div>

                <div className="hidden space-y-3 md:block">
                  {exercise.sets?.map((set, setIndex) => (
                    <ExerciseSetEdit
                      key={setIndex}
                      set={set}
                      index={setIndex}
                      exerciseType={exerciseLogType}
                      onSetChange={(updatedSet) => handleSetChange(setIndex, updatedSet)}
                      onCopy={() => handleCopySet(setIndex)}
                      onRemove={() => handleRemoveSet(setIndex)}
                    />
                  ))}
                  {(!exercise.sets || exercise.sets.length === 0) && (
                    <div className="rounded-lg border border-dashed border-muted-foreground/40 p-4 text-center text-sm text-muted-foreground">
                      No sets yet. Use “Add set” to start building this exercise.
                    </div>
                  )}
                </div>

                <div className="md:hidden">
                  {exercise.sets && exercise.sets.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Set</TableHead>
                            {exerciseLogType === ExerciseLogType.WeightAndReps && (
                              <>
                                <TableHead>Reps</TableHead>
                                <TableHead>Kg</TableHead>
                              </>
                            )}
                            {exerciseLogType === ExerciseLogType.BodyWeight && <TableHead>Reps</TableHead>}
                            {exerciseLogType === ExerciseLogType.BodyWeightWithAdditionalWeight && (
                              <>
                                <TableHead>Reps</TableHead>
                                <TableHead>Extra Kg</TableHead>
                              </>
                            )}
                            {exerciseLogType === ExerciseLogType.BodyWeightWithAssistance && (
                              <>
                                <TableHead>Reps</TableHead>
                                <TableHead>Assist Kg</TableHead>
                              </>
                            )}
                            {exerciseLogType === ExerciseLogType.RepsOnly && <TableHead>Reps</TableHead>}
                            {exerciseLogType === ExerciseLogType.TimeOnly && <TableHead>Time</TableHead>}
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {exercise.sets.map((set, setIndex) => (
                            <TableRow key={setIndex}>
                              <TableCell>{setIndex + 1}</TableCell>
                              {exerciseLogType === ExerciseLogType.WeightAndReps && (
                                <>
                                  <TableCell>{set.reps || "-"}</TableCell>
                                  <TableCell>{set.weight || "-"}</TableCell>
                                </>
                              )}
                              {exerciseLogType === ExerciseLogType.BodyWeight && <TableCell>{set.reps || "-"}</TableCell>}
                              {exerciseLogType === ExerciseLogType.BodyWeightWithAdditionalWeight && (
                                <>
                                  <TableCell>{set.reps || "-"}</TableCell>
                                  <TableCell>{set.weight || "-"}</TableCell>
                                </>
                              )}
                              {exerciseLogType === ExerciseLogType.BodyWeightWithAssistance && (
                                <>
                                  <TableCell>{set.reps || "-"}</TableCell>
                                  <TableCell>{set.weight || "-"}</TableCell>
                                </>
                              )}
                              {exerciseLogType === ExerciseLogType.RepsOnly && <TableCell>{set.reps || "-"}</TableCell>}
                              {exerciseLogType === ExerciseLogType.TimeOnly && (
                                <TableCell>{set.time ? `${set.time}s` : "-"}</TableCell>
                              )}
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    onClick={() => handleCopySet(setIndex)}
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground hover:text-foreground"
                                  >
                                    <Copy className="size-4" aria-hidden />
                                  </Button>
                                  <Button
                                    onClick={() => handleEditSet(setIndex)}
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                  >
                                    <Pencil className="size-4" aria-hidden />
                                  </Button>
                                  <Button
                                    onClick={() => handleRemoveSet(setIndex)}
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-destructive"
                                  >
                                    <X className="size-4" aria-hidden />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">No sets added yet</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>

      <ExerciseSetDrawer
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        set={currentSet}
        index={currentSetIndex !== null ? currentSetIndex : exercise.sets?.length || 0}
        exerciseType={exerciseLogType}
        onSave={handleDialogSave}
        isNew={currentSetIndex === null}
      />
    </Collapsible>
  )
})

