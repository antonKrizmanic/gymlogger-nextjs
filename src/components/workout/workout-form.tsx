"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, BookmarkCheck, Dumbbell, Loader2, StickyNote } from "lucide-react";
import Link from "next/link";
import { useMemo, type ElementType, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { CollapsibleNote } from "@/src/components/common/collapsible-note";
import { DatePicker } from "@/src/components/form/date-picker";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import { IconInput } from "@/src/components/ui/icon-input";
import { cn } from "@/src/lib/utils";
import type { IWorkoutCreate } from "@/src/models/domain/workout";
import { workoutSchema, type WorkoutSchema } from "@/src/schemas/index";
import { ExerciseList } from "./exercise-list";

interface WorkoutFormProps {
  workoutId: string | null;
  workout: IWorkoutCreate;
  isLoading: boolean;
  onSubmit: (workout: IWorkoutCreate) => void;
  cancelHref: string;
}

interface SectionProps {
  icon: ElementType;
  title: string;
  description: string;
  children: ReactNode;
}

function Section({ icon: Icon, title, description, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 className="type-heading-sm text-foreground">{title}</h2>
          <p className="type-body-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function WorkoutForm({ workoutId, workout, isLoading, onSubmit, cancelHref }: WorkoutFormProps) {
  const form = useForm<WorkoutSchema>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: workout.name || "",
      date: workout.date ? new Date(workout.date) : new Date(),
      description: workout.description || "",
      exercises: workout.exercises || [],
    },
  });

  const exercises = form.watch("exercises") || [];

  const exerciseDescription = useMemo(() => {
    if (!exercises.length) {
      return "Add each exercise, sets, and notes in the order you'll perform them.";
    }

    return `You have ${exercises.length} exercise${exercises.length === 1 ? "" : "s"} logged for this session.`;
  }, [exercises.length]);

  const handleSubmit = (data: WorkoutSchema) => {
    const orderedExercises = [...data.exercises].sort((a, b) => a.index - b.index);
    const formattedData = {
      ...data,
      exercises: orderedExercises,
    };

    onSubmit(formattedData as IWorkoutCreate);
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="space-y-2">
        <h1 className="type-heading-lg">Session builder</h1>
        <p className="type-body-md text-muted-foreground">
          Scroll through each section to update details, notes, and exercises without switching steps.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12">
          <Section icon={Dumbbell} title="Workout basics" description="Name your session and lock in the workout date.">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <IconInput icon={Dumbbell} label="Workout name" placeholder="E.g. Push day" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-3">
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
          </Section>

          <Section icon={StickyNote} title="Notes & intent" description="Capture focus areas, tempo cues, or reminders.">
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
          </Section>

          <Section icon={BookmarkCheck} title="Build the routine" description={exerciseDescription}>
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
          </Section>

          <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="size-4" aria-hidden />
              <span className="type-helper">Your workout saves once you choose Save workout.</span>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Button variant="outline" type="button" asChild>
                <Link className="flex items-center justify-center" href={cancelHref}>
                  Cancel
                </Link>
              </Button>
              <Button className={cn("justify-center", isLoading && "cursor-wait")} type="submit" disabled={isLoading}>
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
          </div>
        </form>
      </Form>
    </div>
  );
}
