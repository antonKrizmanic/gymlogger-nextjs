"use client";

import { WorkoutApiService } from "@/src/api/services/workout-api-service";
import { IWorkoutCreate, IWorkoutUpdate } from "@/src/models/domain/workout";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/src/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        router.push(cancelHref);
      }
    },
    [cancelHref, router],
  );

  return (
    <Sheet open onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex h-full w-full flex-col gap-0 overflow-hidden border-0 p-0 sm:max-w-3xl lg:max-w-4xl">
        <div className="border-b border-border px-6 py-5">
          <SheetHeader className="space-y-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>
              {id
                ? "Adjust the details, notes, and exercises for this session."
                : "Outline the details, notes, and exercises for your upcoming session."}
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <WorkoutForm
            workoutId={id || null}
            workout={workoutData}
            onSubmit={handleSubmit}
            cancelHref={cancelHref}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
