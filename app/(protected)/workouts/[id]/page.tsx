import Link from "next/link";

import { Container } from "@/src/components/common/container";
import { Button } from "@/src/components/ui/button";
import { WorkoutDeleteButton } from "@/src/components/workout/workout-delete-button";
import { WorkoutExerciseList } from "@/src/components/workout/workout-exercise-list";
import { getWorkout } from "@/src/data/workout";
import { format } from "date-fns";
import { Activity, Calendar, Dumbbell, MoveLeft, Notebook, Target } from "lucide-react";

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export default async function WorkoutDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = await params.id;
    const workout = await getWorkout(id);

    if (!workout) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
                <Container>
                    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
                            <Activity className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="type-heading-md text-foreground">Workout not found</h2>
                            <p className="max-w-md type-body-sm text-muted-foreground">
                                The session you&apos;re trying to view is no longer available. Return to your workouts list to pick another log.
                            </p>
                        </div>
                        <Button asChild variant="secondary" size="lg" className="rounded-full">
                            <Link href="/workouts">
                                <MoveLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                                Back to workouts
                            </Link>
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    const formatWorkoutDate = (date: string | Date) => {
        try {
            const workoutDate = new Date(date);
            return format(workoutDate, 'PPP'); // e.g., "December 25, 2023"
        } catch {
            return 'Invalid date';
        }
    };

    const formattedDate = formatWorkoutDate(workout.date);

    const timeline = [
        {
            label: "Scheduled session",
            value: formattedDate,
            helper: format(workout.date, "EEEE"),
            icon: Calendar,
        },
        {
            label: "Primary focus",
            value: workout.muscleGroupName ?? "Full body",
            helper: "Muscle group",
            icon: Target,
        },
        {
            label: "Sets logged",
            value: `${workout.totalSets ?? 0} sets`,
            helper: `${workout.totalReps ?? 0} reps • ${workout.totalWeight ?? 0} kg`,
            icon: Dumbbell,
        },
    ];

    const statCards = [
        {
            label: "Total sets",
            value: workout.totalSets ?? 0,
            helper: "Across every exercise",
        },
        {
            label: "Total reps",
            value: workout.totalReps ?? 0,
            helper: "Including warm-up volume",
        },
        {
            label: "Total weight (kg)",
            value: workout.totalWeight ?? 0,
            helper: "Logged during this session",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
            <Container>
                <div className="space-y-10 py-10">
                    <Button
                        asChild
                        variant="ghost"
                        className="w-fit rounded-full bg-background/60 px-4 py-2 text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/workouts" className="flex items-center gap-2">
                            <MoveLeft className="h-4 w-4" aria-hidden="true" />
                            Back to workouts
                        </Link>
                    </Button>

                    <section className="space-y-8 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-card-rest lg:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                    <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                                    Workout overview
                                </div>
                                <div className="space-y-3">
                                    <h1 className="type-heading-lg text-foreground">
                                        {workout.name || "Unnamed workout"}
                                    </h1>
                                    <p className="max-w-2xl type-body-sm text-muted-foreground">
                                        Review the timeline, totals, and per-exercise sets from this training session.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild size="lg" variant="secondary" className="rounded-full">
                                    <Link href={`/workouts/${workout.id}/edit`}>
                                        Edit workout
                                    </Link>
                                </Button>
                                <WorkoutDeleteButton workout={workout} />
                            </div>
                        </div>

                        <ol className="relative grid gap-4 sm:grid-cols-3">
                            {timeline.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <li
                                        key={item.label}
                                        className="relative rounded-3xl border border-border/60 bg-background/80 p-5 shadow-card-rest"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <Icon className="h-6 w-6" aria-hidden="true" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="type-label text-muted-foreground uppercase tracking-wide">{item.label}</p>
                                                <p className="type-body-md font-semibold text-foreground">{item.value}</p>
                                                <p className="type-body-sm text-muted-foreground">{item.helper}</p>
                                            </div>
                                        </div>
                                        {index < timeline.length - 1 ? (
                                            <span className="absolute right-[-24px] top-1/2 hidden h-px w-12 -translate-y-1/2 bg-border sm:block" aria-hidden="true" />
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ol>
                    </section>

                    <section className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {statCards.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-3xl border border-border/60 bg-card/95 px-6 py-5 text-left shadow-card-rest"
                                >
                                    <p className="type-label text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                                    <p className="mt-2 type-heading-md text-foreground">
                                        {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                                    </p>
                                    <p className="mt-1 type-body-sm text-muted-foreground">{stat.helper}</p>
                                </div>
                            ))}
                        </div>

                        {workout.description ? (
                            <div className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-card-rest">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Notebook className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h2 className="type-heading-sm text-foreground">Session notes</h2>
                                        <p className="type-body-sm text-muted-foreground">Captured while logging this workout</p>
                                    </div>
                                </div>
                                <p className="mt-4 whitespace-pre-wrap type-body-sm text-muted-foreground">
                                    {workout.description}
                                </p>
                            </div>
                        ) : null}
                    </section>

                    <WorkoutExerciseList exercises={workout.exercises} userWeight={workout.userWeight} />
                </div>
            </Container>
        </div>
    );
}