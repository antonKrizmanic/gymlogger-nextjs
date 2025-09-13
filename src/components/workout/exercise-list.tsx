"use client"

import { Button } from "@/src/components/ui/button"
import type { IExerciseWorkoutCreate } from "@/src/models/domain/workout"
import { Activity, PlusCircle } from "lucide-react"
import { ExerciseListItem } from "./exercise-list-item"

interface ExerciseListProps {
  exercises: IExerciseWorkoutCreate[]
  onExercisesChange: (exercises: IExerciseWorkoutCreate[]) => void
  workoutId: string | null
}

export function ExerciseList({ exercises, onExercisesChange, workoutId }: ExerciseListProps) {
  const handleAddExercise = () => {
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
  }

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index)
    // Update indices
    updatedExercises.forEach((exercise, i) => {
      exercise.index = i
    })
    onExercisesChange(updatedExercises)
  }

  const handleExerciseSelect = async (index: number, exerciseId: string) => {
    // Update the exercise ID while preserving the index
    const updatedExercises = [...exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      exerciseId,
      sets: updatedExercises[index].sets || [], // Preserve existing sets if any
    }
    onExercisesChange(updatedExercises)
  }

  const onExerciseChange = (exercise: IExerciseWorkoutCreate, index: number) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = exercise
    onExercisesChange(updatedExercises)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Exercises</h2>
          <p className="text-sm text-muted-foreground">
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} added
          </p>
        </div>
      </div>

      {exercises.length > 0 ? (
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <ExerciseListItem
              key={index}
              exercise={exercise}
              index={index}
              onExerciseChange={onExerciseChange}
              onRemoveExercise={handleRemoveExercise}
              onAddExercise={handleExerciseSelect}
              workoutId={workoutId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No exercises yet</h3>
            <p className="text-muted-foreground">Add your first exercise to get started</p>
          </div>
        </div>
      )}

      {/* Add Exercise button */}
      <Button
        type="button"
        onClick={handleAddExercise}
        variant="outline"
        className="w-full h-12 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Exercise
      </Button>
    </div>
  )
}

