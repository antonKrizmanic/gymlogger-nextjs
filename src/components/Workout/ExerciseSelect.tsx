"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import type { IExercise } from "@/src/Models/Domain/Exercise"
import { ExerciseApiService } from "@/src/Api/Services/ExerciseApiService"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Label } from "@/src/components/ui/label"

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
  const [open, setOpen] = useState(false)
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

  const selectedExercise = exercises.find((exercise) => exercise.id === selectedExerciseId)

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="exercise-select" className="mb-2 block">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {selectedExercise ? selectedExercise.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No exercise found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {exercises.map((exercise) => (
                  <CommandItem
                    key={exercise.id}
                    value={exercise.name}
                    onSelect={() => {
                      onExerciseSelect(exercise.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedExerciseId === exercise.id ? "opacity-100" : "opacity-0")}
                    />
                    {exercise.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

