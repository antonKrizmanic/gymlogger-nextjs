"use client"
import type React from "react"
import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { Copy, Info, Pencil, PlusCircle, X } from "lucide-react"

import { ExerciseApiService } from "@/src/api/services/exercise-api-service"
import { ExerciseApiWorkoutService } from "@/src/api/services/exercise-workout-api-service"
import type { IExercise } from "@/src/models/domain/exercise"
import type { IExerciseSetCreate, IExerciseWorkout, IExerciseWorkoutCreate } from "@/src/models/domain/workout"
import { ExerciseLogType } from "@/src/types/enums"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"
import { Label } from "@/src/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Textarea } from "@/src/components/ui/textarea"
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
}

export const ExerciseListItem = memo(function ExerciseListItem({
  exercise,
  index,
  workoutId,
  onExerciseChange,
  onRemoveExercise,
  onAddExercise,
}: ExerciseListItemProps) {
  const [lastExercise, setLastExercise] = useState<IExerciseWorkout | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(null)
  const [isLastWorkoutOpen, setIsLastWorkoutOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentSetIndex, setCurrentSetIndex] = useState<number | null>(null)

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

  const handleExerciseSelect = useCallback(async (exerciseId: string) => {
    console.log("Selected exercise ID:", exerciseId)
    // Let the parent component know about the change
    onAddExercise(index, exerciseId)
  }, [onAddExercise, index])

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const note = e.target.value
    onExerciseChange({ ...exercise, note }, index)
  }, [exercise, index, onExerciseChange])

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

  return (
    <Card className="border-0 border-b-1 rounded-none p-0 pb-4 bg-gradient-to-br from-card to-card/80 overflow-hidden">
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-foreground">
          {index + 1}. Exercise
        </CardTitle>
        {/* Remove button */}
        <Button
          type="button"
          onClick={() => onRemoveExercise(index)}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Remove exercise</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Exercise selection */}
        <div className="w-full">
          <ExerciseSelect
            selectedExerciseId={exercise.exerciseId}
            onExerciseSelect={(exerciseId) => handleExerciseSelect(exerciseId)}
            required
          />
        </div>

        {exerciseDisplayProps.hasDescription && (
          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary/20">
            <p className="text-sm text-muted-foreground">{exerciseDisplayProps.description}</p>
          </div>
        )}

        {/* Notes field */}
        <div className="space-y-2">
          <Label htmlFor={`note-${index}`} className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Exercise Notes
          </Label>
          <Textarea
            id={`note-${index}`}
            value={exercise.note || ""}
            onChange={handleNoteChange}
            className="border-2 min-h-[60px]"
            placeholder="Add notes for this exercise..."
          />
        </div>

        {lastExercise && (
          <Collapsible open={isLastWorkoutOpen} onOpenChange={setIsLastWorkoutOpen} className="border rounded-md p-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-2">
                <span className="text-sm font-medium">Last workout</span>
                <Info className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ExerciseSets exercise={lastExercise} />
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Sets section */}
        {exercise.exerciseId && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Sets</h3>
            </div>

            {/* Desktop view - show the original set editor */}
            <div className="hidden md:block space-y-2">
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
            </div>

            {/* Mobile view - show a table of sets */}
            <div className="md:hidden">
              {exercise.sets && exercise.sets.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] text-gray-500 dark:text-white">Set</TableHead>

                        {exerciseLogType === ExerciseLogType.WeightAndReps && (
                          <>
                            <TableHead className="text-gray-500 dark:text-white">Reps</TableHead>
                            <TableHead className="text-gray-500 dark:text-white">Kg</TableHead>
                          </>
                        )}

                        {exerciseLogType === ExerciseLogType.RepsOnly && <TableHead className="text-gray-500 dark:text-white">Reps</TableHead>}

                        {exerciseLogType === ExerciseLogType.TimeOnly && <TableHead className="text-gray-500 dark:text-white">Time</TableHead>}

                        <TableHead className="w-[70px] text-gray-500 dark:text-white">Actions</TableHead>
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

                          {exerciseLogType === ExerciseLogType.RepsOnly && <TableCell>{set.reps || "-"}</TableCell>}

                          {exerciseLogType === ExerciseLogType.TimeOnly && (
                            <TableCell>{set.time ? `${set.time}s` : "-"}</TableCell>
                          )}

                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                type="button"
                                onClick={() => handleCopySet(setIndex)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleEditSet(setIndex)}
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleRemoveSet(setIndex)}
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No sets added yet</p>
              )}
            </div>

            <Button type="button" onClick={handleAddSet} variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Set
            </Button>
          </div>
        )}
      </CardContent>

      {/* Dialog for adding/editing sets on mobile */}
      <ExerciseSetDrawer
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        set={currentSet}
        index={currentSetIndex !== null ? currentSetIndex : exercise.sets?.length || 0}
        exerciseType={exerciseLogType}
        onSave={handleDialogSave}
        isNew={currentSetIndex === null}
      />
    </Card >
  )
})

