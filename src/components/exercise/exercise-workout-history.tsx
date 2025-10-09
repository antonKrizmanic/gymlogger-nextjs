'use client';

import { useEffect, useState } from 'react';

import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
import { Pagination } from '@/src/components/common/pagination';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ExerciseSets } from '@/src/components/workout/exercise-sets';
import { IExerciseWorkout } from '@/src/models/domain/workout';
import { format } from 'date-fns';
import { Activity, ArrowUpRight, CalendarIcon, ClipboardList, Dumbbell } from 'lucide-react';
import Link from 'next/link';

interface ExerciseWorkoutHistoryProps {
  exerciseId: string;
}

export function ExerciseWorkoutHistory({ exerciseId }: ExerciseWorkoutHistoryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [exerciseWorkouts, setExerciseWorkouts] = useState<IExerciseWorkout[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchExerciseWorkouts = async () => {
      setIsLoading(true);
      try {
        const service = new ExerciseApiWorkoutService();
        const response = await service.getPaginatedExerciseWorkouts(exerciseId, currentPage, pageSize);

        setExerciseWorkouts(response.items);
        setTotalPages(response.pagingData.totalPages);
      } catch (error) {
        console.error('Error fetching exercise workout history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExerciseWorkouts();
  }, [exerciseId, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(0);
  };

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-card/80 shadow-none">
        <CardContent className="flex h-60 flex-col items-center justify-center gap-4 text-muted-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Dumbbell className="h-6 w-6 animate-pulse" aria-hidden="true" />
          </div>
          <p className="type-body-sm">Loading workout history…</p>
        </CardContent>
      </Card>
    );
  }

  if (!exerciseWorkouts.length) {
    return (
      <Card className="border border-dashed border-border/70 bg-card/60 shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/10" />
            <ClipboardList className="h-12 w-12 text-primary" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h3 className="type-heading-sm text-foreground">No workout history yet</h3>
            <p className="mx-auto max-w-md type-body-sm text-muted-foreground">
              Log a workout with this exercise to populate the timeline and analytics. Your most recent sessions will appear here automatically.
            </p>
          </div>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/workouts/create">
              Plan a workout
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const itemsLabel = `${exerciseWorkouts.length} workout${exerciseWorkouts.length === 1 ? '' : 's'} in view`;

  return (
    <div className="space-y-6">
      <Card className="border border-border/60 bg-background/70 shadow-none">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="type-heading-sm text-foreground">Workout history</CardTitle>
              <CardDescription className="type-body-sm text-muted-foreground">{itemsLabel}</CardDescription>
            </div>
          </div>
          <div className="type-body-sm text-muted-foreground">Page {currentPage + 1} of {Math.max(totalPages, 1)}</div>
        </CardHeader>
      </Card>

      <div className="grid gap-5">
        {exerciseWorkouts.map((workout) => {
          const workoutDate = workout.workoutDate ? format(new Date(workout.workoutDate), 'PPP') : 'Unknown date';

          const summary = [
            workout.totalSets ? `${workout.totalSets} sets` : null,
            workout.totalReps ? `${workout.totalReps} reps` : null,
            workout.totalWeight && workout.totalWeight > 0 ? `${workout.totalWeight} kg` : null,
          ].filter(Boolean).join(' • ');

          return (
            <Card
              key={workout.workoutId}
              className="group overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-card-rest transition-all duration-200 motion-base hover:-translate-y-1 hover:shadow-card-hover"
            >
              <CardHeader className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <CardTitle className="type-heading-sm text-foreground">
                    {workout.workoutName || 'Untitled workout'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                    <span>{workoutDate}</span>
                  </CardDescription>
                  {summary ? (
                    <p className="type-body-sm text-muted-foreground">{summary}</p>
                  ) : null}
                </div>
                <Button asChild variant="ghost" size="sm" className="rounded-full border border-border/70 bg-background/80 hover:bg-primary/10 hover:text-primary">
                  <Link href={`/workouts/${workout.workoutId}`} className="inline-flex items-center gap-2">
                    View workout
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-5 p-6">
                {workout.note ? (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-muted/50 p-4">
                    <p className="type-body-sm text-muted-foreground">{workout.note}</p>
                  </div>
                ) : null}

                <ExerciseSets exercise={workout} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      ) : null}
    </div>
  );
}