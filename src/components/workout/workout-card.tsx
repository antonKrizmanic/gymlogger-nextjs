import Link from "next/link";

import { WorkoutApiService } from "@/src/api/services/workout-api-service";
import { IWorkoutSimple } from "@/src/models/domain/workout";
import { format } from "date-fns";
import { Calendar, Eye, Pencil, Target } from "lucide-react";

import { DeleteButton } from "../common/delete-button";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

interface WorkoutCardProps {
    workout: IWorkoutSimple;
    onDelete?: () => void;
}

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
    const deleteAction = async () => {
        const service = new WorkoutApiService();
        await service.deleteWorkout(workout.id);
    };

    const formatWorkoutDate = (date: string | Date) => {
        try {
            const workoutDate = new Date(date);
            return format(workoutDate, 'PPP'); // e.g., "December 25, 2023"
        } catch {
            return 'Invalid date';
        }
    };

    const metrics = [
        {
            label: "Total sets",
            value: workout.totalSets ?? 0,
        },
        {
            label: "Total reps",
            value: workout.totalReps ?? 0,
        },
        {
            label: "Volume (kg)",
            value: workout.totalWeight ?? 0,
        },
    ];

    return (
        <Card className="group relative flex h-full flex-col overflow-hidden border border-border/70 bg-card/95 shadow-card-rest transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-within:shadow-card-hover">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
            <CardHeader className="space-y-5 pb-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-3">
                        <CardTitle className="type-heading-sm text-foreground">
                            {workout.name || "Untitled workout"}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                {formatWorkoutDate(workout.date)}
                            </span>
                            {workout.muscleGroupName ? (
                                <Badge variant="outline" className="inline-flex items-center gap-1.5 rounded-full border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold">
                                    <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                    {workout.muscleGroupName}
                                </Badge>
                            ) : null}
                        </div>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        Logged
                    </div>
                </div>

                {workout.description ? (
                    <CardDescription className="line-clamp-3 text-muted-foreground">
                        {workout.description}
                    </CardDescription>
                ) : null}
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
                <div className="grid gap-3 sm:grid-cols-3">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-center shadow-card-rest"
                        >
                            <div className="type-label text-muted-foreground uppercase tracking-wide">{metric.label}</div>
                            <div className="type-heading-sm text-foreground">
                                {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/60 bg-muted/30 px-6 py-4">
                <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="flex-1 justify-center rounded-full border border-border/60 bg-background/80 text-foreground hover:bg-background/90"
                >
                    <Link href={`/workouts/${workout.id}`}>
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        View
                    </Link>
                </Button>
                <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="flex-1 justify-center rounded-full"
                >
                    <Link href={`/workouts/${workout.id}/edit`}>
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Edit
                    </Link>
                </Button>
                <DeleteButton
                    entityName={workout.name || "Untitled workout"}
                    entityType="Workout"
                    deleteAction={deleteAction}
                    onDelete={onDelete}
                    size="sm"
                    text="Delete"
                    className="flex-1"
                />
            </CardFooter>
        </Card>
    );
}