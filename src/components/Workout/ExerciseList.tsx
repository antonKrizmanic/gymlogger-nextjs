"use client"

import { PlusCircle } from "lucide-react"
import type { IExerciseWorkoutCreate } from "@/src/Models/Domain/Workout"
import { ExerciseListItem } from "./ExerciseListItem"
import { Button } from "@/src/components/ui/button"

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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Exercises</h2>

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

      {/* Add Exercise button */}
      <Button type="button" onClick={handleAddExercise} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Exercise
      </Button>
    </div>
  )
}

