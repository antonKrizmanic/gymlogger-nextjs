"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertCircle,
  BookmarkCheck,
  CalendarClock,
  CheckCircle2,
  Dumbbell,
  Info,
  Loader2,
  StickyNote,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { CollapsibleNote } from "@/src/components/common/collapsible-note"
import { DatePicker } from "@/src/components/form/date-picker"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form"
import { IconInput } from "@/src/components/ui/icon-input"
import { cn } from "@/src/lib/utils"
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

  const [activeStep, setActiveStep] = useState(0)
  const [helpStepIndex, setHelpStepIndex] = useState<number | null>(null)

  const exercises = form.watch("exercises") || []

  const steps = useMemo(
    () => [
      {
        id: "basics",
        title: "Workout basics",
        description: "Name your session and lock in the workout date.",
        icon: Dumbbell,
        fields: ["name", "date"],
        helper: {
          title: "Tips for naming workouts",
          body: "Use consistent patterns like 'Upper Body Push' or 'Week 5 - Power Day' so the workout list remains easy to scan.",
        },
      },
      {
        id: "notes",
        title: "Notes & intent",
        description: "Capture focus areas, tempo cues, or reminders.",
        icon: StickyNote,
        fields: ["description"],
        helper: {
          title: "What makes a useful note?",
          body: "Add context for future you—intent, fatigue levels, or equipment adjustments you want to remember next time.",
        },
      },
      {
        id: "exercises",
        title: "Build the routine",
        description: exercises.length
          ? `You have ${exercises.length} exercise${exercises.length === 1 ? "" : "s"} in this session.`
          : "Add each exercise, sets, and notes in the order you'll perform them.",
        icon: BookmarkCheck,
        fields: ["exercises"],
        helper: {
          title: "Organizing exercises",
          body: "Group similar movements together and keep superset partners adjacent so dragging and reordering stays intuitive.",
        },
      },
    ],
    [exercises.length],
  )

  const totalSteps = steps.length
  const progress = ((activeStep + 1) / totalSteps) * 100

  const openStepHelp = useCallback((index: number) => {
    setHelpStepIndex(index)
  }, [])

  const handleSubmit = (data: WorkoutSchema) => {
    // Ensure exercises are in the correct order before submitting
    const orderedExercises = [...data.exercises].sort((a, b) => a.index - b.index)
    const formattedData = {
      ...data,
      exercises: orderedExercises,
    }

    onSubmit(formattedData as IWorkoutCreate)
  }

  const handleNext = useCallback(async () => {
    const step = steps[activeStep]
    const isValid = await form.trigger(step.fields, { shouldFocus: true })
    if (!isValid) {
      return
    }
    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [activeStep, form, steps, totalSteps])

  const handlePrevious = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleStepClick = useCallback(
    (index: number) => {
      if (index <= activeStep) {
        setActiveStep(index)
      }
    },
    [activeStep],
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="type-heading-lg">{title}</h1>
        <p className="type-body-md text-muted-foreground">
          Shape the flow of your session with guided steps and reusable building blocks.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
          <Card className="sticky top-28 hidden h-fit flex-col gap-6 border-2 p-6 lg:flex">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="type-label text-muted-foreground">Progress</p>
                <span className="type-label text-foreground">{activeStep + 1} / {totalSteps}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === activeStep
                const isComplete = index < activeStep

                return (
                  <button
                    type="button"
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                      isActive
                        ? "border-primary/70 bg-primary/10 shadow-card-hover"
                        : isComplete
                        ? "border-transparent bg-muted/60 hover:border-muted-foreground/20"
                        : "border-transparent bg-muted/40 hover:bg-muted/60",
                      index > activeStep && "cursor-not-allowed opacity-60",
                    )}
                    disabled={index > activeStep}
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-background shadow-inner">
                      {isComplete ? (
                        <CheckCircle2 className="size-5 text-primary" aria-hidden />
                      ) : isActive ? (
                        <CalendarClock className="size-5 text-primary" aria-hidden />
                      ) : (
                        <Icon className="size-5 text-muted-foreground" aria-hidden />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="type-label text-foreground">{step.title}</p>
                      <p className="type-helper text-muted-foreground">{step.description}</p>
                    </div>
                    <span className="sr-only">{isComplete ? "Completed" : isActive ? "Current" : "Pending"} step</span>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="border-2">
            <CardContent className="space-y-10 p-6 sm:p-8">
              {steps.map((step, index) => {
                const isActive = index === activeStep
                const Icon = step.icon

                if (!isActive) {
                  return null
                }

                return (
                  <div key={step.id} className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-6" aria-hidden />
                        </div>
                        <div>
                          <p className="type-heading-sm">{step.title}</p>
                          <p className="type-body-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => openStepHelp(index)}
                      >
                        <Info className="size-4" aria-hidden />
                        Need guidance?
                      </Button>
                    </div>

                    {step.id === "basics" && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <IconInput
                                  icon={Dumbbell}
                                  label="Workout name"
                                  placeholder="E.g. Push day"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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
                                  label="Workout date"
                                  placeholder="Select workout date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {step.id === "notes" && (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <CollapsibleNote
                              label="Description (optional)"
                              value={field.value || ""}
                              onChange={(val) => field.onChange(val)}
                              icon={StickyNote}
                              placeholder="Add workout notes or intention..."
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {step.id === "exercises" && (
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
                    )}

                    <div className="flex flex-col gap-3 border-t border-dashed border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="size-4" aria-hidden />
                        <span className="type-helper">
                          Progress is saved when you hit Save workout on the final step.
                        </span>
                      </div>
                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                        {activeStep > 0 && (
                          <Button type="button" variant="outline" onClick={handlePrevious}>
                            Previous
                          </Button>
                        )}
                        {activeStep < totalSteps - 1 ? (
                          <Button type="button" onClick={handleNext}>
                            Continue
                          </Button>
                        ) : (
                          <div className="flex flex-col gap-3 sm:flex-row">
                            <Button variant="outline" type="button" asChild>
                              <Link className="flex items-center justify-center" href={cancelHref}>
                                Cancel
                              </Link>
                            </Button>
                            <Button className="justify-center" type="submit" disabled={isLoading}>
                              {isLoading ? (
                                <>
                                  <Loader2 className="size-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>Save workout</>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </form>
      </Form>

      <Dialog open={helpStepIndex !== null} onOpenChange={(open) => setHelpStepIndex(open ? helpStepIndex : null)}>
        <DialogContent>
          <DialogHeader className="space-y-2">
            <DialogTitle>{helpStepIndex !== null ? steps[helpStepIndex].helper.title : ""}</DialogTitle>
            <DialogDescription>{helpStepIndex !== null ? steps[helpStepIndex].helper.body : ""}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

