import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { formatDate, formatNumber } from "@/src/lib/utils";
import { IDashboard } from "@/src/models/domain/dashboard";
import {
    CalendarDays,
    Clock,
    Dumbbell,
    Eye,
    Pencil,
    Target,
    Trophy,
    Weight,
} from "lucide-react";

interface LatestWorkoutCardProps {
    workout: NonNullable<IDashboard["lastWorkout"]>;
}

export function LatestWorkoutCard({ workout }: LatestWorkoutCardProps) {
    const timeline = [
        {
            id: "logged",
            title: "Workout logged",
            description: formatDate(workout.date),
            icon: <CalendarDays className="h-4 w-4" aria-hidden="true" />,
        },
        {
            id: "sets",
            title: "Sets completed",
            description: `${formatNumber(workout.totalSets)} sets across all exercises`,
            icon: <Target className="h-4 w-4" aria-hidden="true" />,
        },
        {
            id: "reps",
            title: "Reps recorded",
            description: `${formatNumber(workout.totalReps)} repetitions in total`,
            icon: <Clock className="h-4 w-4" aria-hidden="true" />,
        },
        {
            id: "weight",
            title: "Volume moved",
            description: `${formatNumber(workout.totalWeight)} kg lifted overall`,
            icon: <Weight className="h-4 w-4" aria-hidden="true" />,
        },
    ];

    return (
        <section className="space-y-4">
            <h2 className="type-heading-lg text-foreground flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" aria-hidden="true" />
                Latest achievement
            </h2>
            <Card className="border-0 bg-gradient-to-br from-primary/5 via-card to-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                            <CardTitle className="type-heading-sm text-foreground">
                                {workout.name ?? "Unnamed workout"}
                            </CardTitle>
                            {workout.description ? (
                                <CardDescription className="type-body-sm text-muted-foreground max-w-2xl">
                                    {workout.description}
                                </CardDescription>
                            ) : null}
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
                                    <Clock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                                    {formatDate(workout.date)}
                                </Badge>
                                {workout.muscleGroupName ? (
                                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold">
                                        <Dumbbell className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                                        {workout.muscleGroupName}
                                    </Badge>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Dumbbell className="h-6 w-6" aria-hidden="true" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ol className="relative space-y-6 border-l border-border/50 pl-6">
                        {timeline.map((item, index) => (
                            <li key={item.id} className="relative">
                                <span className="absolute -left-[30px] flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-card text-primary shadow-sm">
                                    {item.icon}
                                </span>
                                <div className="space-y-1">
                                    <p className="type-body-sm font-semibold text-foreground">
                                        {item.title}
                                    </p>
                                    <p className="type-body-sm text-muted-foreground">{item.description}</p>
                                </div>
                                {index !== timeline.length - 1 ? (
                                    <span className="absolute -left-[16px] top-9 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t border-primary/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild size="sm">
                            <Link href={`/workouts/${workout.id}`}>
                                <Eye className="h-4 w-4" aria-hidden="true" />
                                View details
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                            <Link href={`/workouts/${workout.id}/edit`}>
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                                Edit workout
                            </Link>
                        </Button>
                    </div>
                    <p className="type-body-sm text-muted-foreground">
                        Keep the streak alive by starting a new session from the dashboard summary above.
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
}
