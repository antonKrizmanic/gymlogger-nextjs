"use client"

import { useState, useEffect } from "react"
import type { IExercise } from "@/src/Models/Domain/Exercise"
import { ExerciseApiService } from "@/src/Api/Services/ExerciseApiService"
import { Label } from "@/src/components/ui/label"
import { ResponsiveCombobox } from "../Form/responsive-combobox"

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

  const selectedExercise = exercises.find((exercise) => exercise.id === selectedExerciseId)

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="exercise-select" className="mb-2 block">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <ResponsiveCombobox
        items={exercises.map((exercise) => ({
          value: exercise.id,
          label: exercise.name,
        }))}
        placeholder={placeholder}
        emptyMessage="No exercise found."
        filterPlaceholder="Search exercises..."
        value={selectedExercise ? { value: selectedExercise.id, label: selectedExercise.name } : null}
        onValueChange={(item) => {
          if (item) {
            console.log("Selected exercise:", item)
            onExerciseSelect(item.value)
          }
        }}/>      
    </div>
  )
}

