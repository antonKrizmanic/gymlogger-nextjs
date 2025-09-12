"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"

import { DatePicker } from "@/src/components/form/date-picker"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import type { IWorkoutCreate } from "@/src/models/domain/workout"
import { workoutSchema, type WorkoutSchema } from "@/src/schemas/index"
import { ExerciseList } from "./exercise-list"

interface WorkoutFormProps {
  workoutId: string | null
  title: string
  workout: IWorkoutCreate
  isLoading: boolean
  onSubmit: (workout: IWorkoutCreate) => void
  cancelHref: string
}

export function WorkoutForm({ workoutId, title, workout, isLoading, onSubmit, cancelHref }: WorkoutFormProps) {
  const form = useForm<WorkoutSchema>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: workout.name || "",
      date: workout.date ? new Date(workout.date) : new Date(),
      description: workout.description || "",
      exercises: workout.exercises || [],
    },
  })

  const handleSubmit = (data: WorkoutSchema) => {
    // Ensure exercises are in the correct order before submitting
    const orderedExercises = [...data.exercises].sort((a, b) => a.index - b.index)
    const formattedData = {
      ...data,
      exercises: orderedExercises,
    }

    onSubmit(formattedData as IWorkoutCreate)
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-display">{title}</CardTitle>
        <CardDescription>Fill in workout details and exercises below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exercise list */}
            <FormField
              control={form.control}
              name="exercises"
              render={({ field }) => (
                <FormItem>
                  <ExerciseList workoutId={workoutId} exercises={field.value} onExercisesChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit and Cancel buttons */}
            <div className="sticky bottom-0 z-10 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-2 py-3 -mx-2 border-t border-border flex md:flex-row flex-col-reverse justify-end gap-4">
              <Button variant="outline" type="button" className="hover:translate-y-[-1px] transition-transform">
                <Link className="flex items-center justify-center w-full h-full" href={cancelHref}>
                  Cancel
                </Link>
              </Button>
              <Button className="justify-center hover:translate-y-[-1px] transition-transform" type="submit" disabled={isLoading} variant="accent">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

