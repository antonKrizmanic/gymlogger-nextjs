"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, ChevronUp, Dumbbell, Loader2, MessageSquare, StickyNote } from "lucide-react"
import Link from "next/link"
import React from "react"
import { useForm } from "react-hook-form"

import { DatePicker } from "@/src/components/form/date-picker"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form"
import { IconInput, IconTextarea } from "@/src/components/ui/icon-input"
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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false)
  const [isEditingDescription, setIsEditingDescription] = React.useState(false)

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

  const handleToggleDescription = React.useCallback(() => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }, [isDescriptionExpanded])

  const handleEditDescription = React.useCallback(() => {
    setIsEditingDescription(true)
    setIsDescriptionExpanded(true)
  }, [isEditingDescription, isDescriptionExpanded])

  const handleSaveDescription = React.useCallback(() => {
    // Exit edit mode
    setIsEditingDescription(false)
    // Always collapse after saving
    setIsDescriptionExpanded(false)
  }, [])

  const handleCancelDescription = React.useCallback(() => {
    // Reset to original value
    form.setValue('description', workout.description || '')
    setIsEditingDescription(false)
    // Always collapse after canceling
    setIsDescriptionExpanded(false)
  }, [form, workout.description])

  // Don't auto-expand description - let user decide

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">Create and customize your workout routine</p>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <span>Workout Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <IconInput
                          icon={Dumbbell}
                          label="Workout Name"
                          placeholder="Enter workout name..."
                          {...field}
                        />
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
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          required
                          label="Workout Date"
                          placeholder="Select workout date..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    {/* Collapsed state - show when not expanded */}
                    {!isDescriptionExpanded && (
                      <div
                        className="border border-dashed border-muted-foreground/30 rounded-lg p-3 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                        onClick={handleToggleDescription}
                      >
                        {field.value?.trim() ? (
                          // Show preview when there's a description
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <StickyNote className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground">Description (Optional)</span>
                              </div>
                              <p className="text-sm text-foreground line-clamp-2 break-words">
                                {field.value}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditDescription()
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                Edit
                              </Button>
                              {isDescriptionExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        ) : (
                          // Show "Add Description" when no description exists
                          <div className="flex items-center justify-center space-x-2 py-2">
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Add workout description</span>
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expanded state - show when expanded */}
                    {isDescriptionExpanded && (
                      <div className="border border-muted-foreground/20 rounded-lg p-4 bg-muted/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <StickyNote className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Description (Optional)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelDescription}
                              className="h-8 px-3 text-sm font-medium"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={handleSaveDescription}
                              className="h-8 px-3 text-sm font-medium bg-primary hover:bg-primary/90"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                        <IconTextarea
                          icon={StickyNote}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="Add workout notes or description..."
                        />
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exercise list */}
              <div className="space-y-4">
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
              </div>

              {/* Submit and Cancel buttons */}
              <div className="flex md:flex-row flex-col-reverse justify-end gap-4">
                <Button variant="outline" type="button">
                  <Link className="flex items-center justify-center w-full h-full" href={cancelHref}>
                    Cancel
                  </Link>
                </Button>
                <Button className="justify-center" type="submit" disabled={isLoading}>
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
    </div>
  )
}

