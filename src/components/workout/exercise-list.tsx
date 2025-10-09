"use client"

import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import type { IExerciseWorkoutCreate } from "@/src/models/domain/workout"
import { Activity, GripVertical, PlusCircle } from "lucide-react"

import { cn } from "@/src/lib/utils"
import { ExerciseListItem } from "./exercise-list-item"

interface ExerciseListProps {
  exercises: IExerciseWorkoutCreate[]
  onExercisesChange: (exercises: IExerciseWorkoutCreate[]) => void
  workoutId: string | null
}

export const ExerciseList = memo(function ExerciseList({ exercises, onExercisesChange, workoutId }: ExerciseListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(exercises.length ? 0 : null)

  useEffect(() => {
    if (exercises.length === 0) {
      setExpandedIndex(null)
      return
    }

    if (expandedIndex === null || expandedIndex >= exercises.length) {
      setExpandedIndex(exercises.length - 1)
    }
  }, [expandedIndex, exercises.length])

  const handleAddExercise = useCallback(() => {
    const newExercise: IExerciseWorkoutCreate = {
      exerciseId: "",
      index: exercises.length,
      note: "",
      sets: [],
    }
    const updatedExercises = [...exercises, newExercise]

    // Ensure indices are correct
    updatedExercises.forEach((exercise, i) => {
      exercise.index = i
    })

    onExercisesChange(updatedExercises)
  }, [exercises, onExercisesChange])

  const handleRemoveExercise = useCallback((index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index)
    // Update indices
    updatedExercises.forEach((exercise, i) => {
      exercise.index = i
    })
    onExercisesChange(updatedExercises)
  }, [exercises, onExercisesChange])

  const handleExerciseSelect = useCallback(async (index: number, exerciseId: string) => {
    // Update the exercise ID while preserving the index
    const updatedExercises = [...exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      exerciseId,
      sets: updatedExercises[index].sets || [], // Preserve existing sets if any
    }
    onExercisesChange(updatedExercises)
  }, [exercises, onExercisesChange])

  const onExerciseChange = useCallback((exercise: IExerciseWorkoutCreate, index: number) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = exercise
    onExercisesChange(updatedExercises)
  }, [exercises, onExercisesChange])

  const reorderExercises = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= exercises.length || fromIndex === toIndex) {
        return
      }

      const updatedExercises = [...exercises]
      const [moved] = updatedExercises.splice(fromIndex, 1)
      updatedExercises.splice(toIndex, 0, moved)
      updatedExercises.forEach((exercise, i) => {
        exercise.index = i
      })
      onExercisesChange(updatedExercises)
      setExpandedIndex(toIndex)
    },
    [exercises, onExercisesChange],
  )

  const handleDrop = useCallback(
    (targetIndex: number) => {
      if (draggedIndex === null) return
      reorderExercises(draggedIndex, targetIndex)
      setDraggedIndex(null)
      setDragOverIndex(null)
    },
    [draggedIndex, reorderExercises],
  )

  const handleMoveUp = useCallback((index: number) => {
    reorderExercises(index, index - 1)
  }, [reorderExercises])

  const handleMoveDown = useCallback((index: number) => {
    reorderExercises(index, index + 1)
  }, [reorderExercises])

  // Memoize exercise statistics
  const exerciseStats = useMemo(() => ({
    count: exercises.length,
    pluralText: exercises.length !== 1 ? 's' : '',
    hasExercises: exercises.length > 0,
  }), [exercises.length])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Activity className="size-5" aria-hidden />
          </div>
          <div>
            <h2 className="type-heading-sm">Exercises</h2>
            <p className="type-helper text-muted-foreground">
              {exerciseStats.count} exercise{exerciseStats.pluralText} added
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1 bg-muted/60">
          <GripVertical className="size-3.5 text-muted-foreground" aria-hidden />
          Drag to reorder
        </Badge>
      </div>

      {exerciseStats.hasExercises ? (
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.exerciseId ? `${exercise.exerciseId}-${index}` : `empty-${index}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(event) => {
                event.preventDefault()
                if (index !== draggedIndex) {
                  setDragOverIndex(index)
                }
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(event) => {
                event.preventDefault()
                handleDrop(index)
              }}
              onDragEnd={() => {
                setDraggedIndex(null)
                setDragOverIndex(null)
              }}
              className={cn(
                "rounded-2xl border border-border/60 bg-card shadow-card transition",
                dragOverIndex === index && "border-primary shadow-card-hover",
                draggedIndex === index && "opacity-75",
              )}
            >
              <ExerciseListItem
                exercise={exercise}
                index={index}
                workoutId={workoutId}
                onExerciseChange={onExerciseChange}
                onRemoveExercise={handleRemoveExercise}
                onAddExercise={handleExerciseSelect}
                isExpanded={expandedIndex === index}
                onToggle={(open) => setExpandedIndex(open ? index : null)}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                isFirst={index === 0}
                isLast={index === exercises.length - 1}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-dashed border-border p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted/60">
            <Activity className="size-8 text-muted-foreground" aria-hidden />
          </div>
          <div className="space-y-1">
            <h3 className="type-heading-xs">No exercises yet</h3>
            <p className="type-helper text-muted-foreground">Add your first exercise to get started</p>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={handleAddExercise}
        variant="outline"
        className="h-12 w-full border-2 hover:border-primary/60 hover:bg-primary/5 transition"
      >
        <PlusCircle className="mr-2 size-5" aria-hidden />
        Add exercise
      </Button>
    </div>
  )
})

