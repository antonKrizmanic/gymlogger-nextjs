"use client"

import { useState, useEffect } from "react"
import type { IExercise } from "@/src/Models/Domain/Exercise"
import { ExerciseApiService } from "@/src/Api/Services/ExerciseApiService"
import { ResponsiveCombobox } from "../Form/responsive-combobox"
import { Label } from "../ui/label"
import { cn } from "@/src/lib/utils"

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
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setIsLoading(true)
                const service = new ExerciseApiService()
                const response = await service.getAllExercises()

                setExercises(response || [])
            } catch (error) {
                console.error("Failed to fetch exercises:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchExercises()
    }, [])

    const handleExerciseSelect = (exerciseId: string) => {
        onExerciseSelect(exerciseId)
    }

    return (
        <>
        {label && (
            <Label htmlFor='exercise-select' className={cn("block text-sm font-medium")}>
              {label} {required && <span className="text-destructive">*</span>}
            </Label>
          )}
        <ResponsiveCombobox
            items={exercises.map(exercise => ({
                value: exercise.id,
                label: exercise.name,
            }))}
            placeholder="Select exercise"
            emptyMessage="No exercises found"
            filterPlaceholder="Filter exercises..."
            value={exercises.map(e => ({
                value: e.id,
                label: e.name,
            })).find(exercise => exercise.value === selectedExerciseId) || null}
            defaultValue={null}
            onValueChange={(exercise) => handleExerciseSelect(exercise?.value || "")}
        />
        </>
    )
}

