"use client"

import { ExerciseApiService } from "@/src/api/services/exercise-api-service"
import { ResponsiveCombobox, type ComboboxItem } from "@/src/components/form/responsive-combobox"
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

  // Convert exercises to combobox items
  const selectOptions: ComboboxItem[] = exercises.map((exercise) => ({
    value: exercise.id,
    label: exercise.name,
  }))

  const selectedItem = selectOptions.find(o => o.value === selectedExerciseId) || null

  return (
    <ResponsiveCombobox
      icon={Target}
      label={`${label} ${required ? '*' : ''}`}
      placeholder={placeholder}
      emptyMessage="No exercises found"
      filterPlaceholder="Search exercises..."
      value={selectedItem}
      onValueChange={(item) => onExerciseSelect(item?.value || "")}
      items={selectOptions}
      className={className}
    />
  )
}

