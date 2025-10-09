"use client";

import { WorkoutApiService } from "@/src/api/services/workout-api-service";
import { IWorkoutCreate, IWorkoutUpdate } from "@/src/models/domain/workout";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { WorkoutForm } from "./workout-form";

interface ClientWorkoutFormProps {
  title: string;
  workout: IWorkoutCreate;
  id?: string; // Optional id for edit mode
  cancelHref: string;
}

export function ClientWorkoutForm({ title, workout, id, cancelHref }: ClientWorkoutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // For new workouts (no id), always use current date
  const workoutData = useMemo(() => {
    if (id) {
      return workout;
    }

    return {
      ...workout,
      date: new Date(),
    };
  }, [id, workout]);

  const handleSubmit = async (formData: IWorkoutCreate) => {
    // Basic validation
    if (!formData.name || !formData.date) {
      toast.error("Name and date are required");
      return;
    }

    setIsLoading(true);

    try {
      const service = new WorkoutApiService();

      if (id) {
        // Update existing workout
        const updateData: IWorkoutUpdate = {
          ...formData,
          id,
        };
        await service.updateWorkout(id, updateData);
        toast.success("Workout updated successfully!");
        router.push("/workouts");
      } else {
        // Create new workout
        await service.createWorkout(formData);

        toast.success("Workout created successfully!");
        router.push("/workouts");
      }
    } catch (error) {
      console.error(`Failed to ${id ? "update" : "create"} workout:`, error);
      toast.error(`Failed to ${id ? "update" : "create"} workout. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3 border-b border-border pb-6">
        <p className="type-label-sm text-primary/80">{id ? "Edit workout" : "Create workout"}</p>
        <h1 className="type-heading-xl">{title}</h1>
        <p className="type-body-md text-muted-foreground">
          {id
            ? "Adjust the details, notes, and exercises for this session."
            : "Outline the details, notes, and exercises for your upcoming session."}
        </p>
      </div>

      <div className="pt-8">
        <WorkoutForm
          workoutId={id || null}
          workout={workoutData}
          onSubmit={handleSubmit}
          cancelHref={cancelHref}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
