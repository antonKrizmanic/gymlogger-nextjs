"use client"

import { ExerciseApiService } from "@/src/api/services/exercise-api-service"
import { IconSelect } from "@/src/components/ui/icon-input"
import type { IExercise } from "@/src/models/domain/exercise"
import { Target } from "lucide-react"
import { useEffect, useState } from "react"

interface ExerciseSelectProps {
  selectedExerciseId?: string
  onExerciseSelect: (exerciseId: string) => void
  required?: boolean
  label?: string
  placeholder?: string
  className?: string
}

export function ExerciseSelect({
  selectedExerciseId,
  onExerciseSelect,
  required = false,
  label = "Exercise",
  placeholder = "Search exercises...",
  className,
}: ExerciseSelectProps) {
  const [exercises, setExercises] = useState<IExercise[]>([])

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const service = new ExerciseApiService()
        const response = await service.getAllExercises()

        setExercises(response || [])
      } catch (error) {
        console.error("Failed to fetch exercises:", error)
      }
    }
    fetchExercises()
  }, [])

  // Convert exercises to IconSelect format
  const selectOptions = exercises.map((exercise) => ({
    value: exercise.id,
    label: exercise.name,
  }))

  return (
    <IconSelect
      icon={Target}
      label={`${label} ${required ? '*' : ''}`}
      placeholder={placeholder}
      value={selectedExerciseId}
      onValueChange={onExerciseSelect}
      options={selectOptions}
      className={className}
    />
  )
}

