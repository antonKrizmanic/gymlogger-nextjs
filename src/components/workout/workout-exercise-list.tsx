import Link from "next/link";

import { Card } from "@/src/components/ui/card";
import { IExerciseWorkout } from "@/src/models/domain/workout";
import { ExerciseLogType } from "@/src/types/enums";
import { getLogTypeInfo } from "@/src/utils/get-log-type-info";
import { Activity, ChevronDown, Target, Weight } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ExerciseSets } from "./exercise-sets";

interface WorkoutExerciseListProps {
    exercises: IExerciseWorkout[];
    userWeight?: number;
}

export function WorkoutExerciseList({ exercises, userWeight }: WorkoutExerciseListProps) {
    if (!exercises || exercises.length === 0) {
        return (
            <Card className="rounded-3xl border border-border/60 bg-card/95 shadow-card-rest">
                <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
                        <Activity className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="type-heading-sm text-foreground">No exercises logged</h3>
                        <p className="type-body-sm text-muted-foreground max-w-md">
                            Add movements to this session to see set-by-set tracking, notes, and progress summaries here.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                    <p className="type-label text-muted-foreground uppercase tracking-wide">Exercises</p>
                    <h2 className="type-heading-md text-foreground">{exercises.length} movement{exercises.length === 1 ? "" : "s"}</h2>
                </div>
            </header>

            <div className="space-y-4">
                {exercises.map((exercise, index) => {
                    const logTypeInfo = getLogTypeInfo(exercise.exerciseLogType);
                    const LogTypeIcon = logTypeInfo.icon;

                    const summaryChips = [
                        exercise.totalSets != null
                            ? `${exercise.totalSets} set${exercise.totalSets === 1 ? "" : "s"}`
                            : null,
                        exercise.totalReps != null
                            ? `${exercise.totalReps} rep${exercise.totalReps === 1 ? "" : "s"}`
                            : null,
                        exercise.totalWeight != null
                            ? `${exercise.totalWeight} kg`
                            : null,
                    ].filter(Boolean) as string[];

                    const showBodyweightBadge =
                        Boolean(userWeight) &&
                        [
                            ExerciseLogType.BodyWeight,
                            ExerciseLogType.BodyWeightWithAdditionalWeight,
                            ExerciseLogType.BodyWeightWithAssistance,
                        ].includes(exercise.exerciseLogType);

                    return (
                        <Collapsible key={exercise.exerciseId} defaultOpen={index === 0} className="group/collapsible">
                            <Card className="overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-card-rest">
                                <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between">
                                    <CollapsibleTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex w-full flex-1 items-center justify-between gap-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-primary/30"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="type-heading-sm text-foreground">
                                                        {exercise.exerciseName || "Untitled exercise"}
                                                    </span>
                                                    <Badge
                                                        variant={logTypeInfo.variant}
                                                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                                                    >
                                                        <LogTypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                                        {logTypeInfo.label}
                                                    </Badge>
                                                    {showBodyweightBadge ? (
                                                        <Badge variant="outline" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
                                                            <Weight className="h-3.5 w-3.5" aria-hidden="true" />
                                                            Bodyweight {userWeight}kg
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                                {exercise.exerciseDescription ? (
                                                    <p className="type-body-sm text-muted-foreground line-clamp-2">
                                                        {exercise.exerciseDescription}
                                                    </p>
                                                ) : null}
                                                {summaryChips.length ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {summaryChips.map((chip) => (
                                                            <span
                                                                key={chip}
                                                                className="inline-flex items-center rounded-full border border-border/50 bg-background/80 px-3 py-1 text-xs font-semibold text-muted-foreground"
                                                            >
                                                                {chip}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" aria-hidden="true" />
                                        </button>
                                    </CollapsibleTrigger>

                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="self-start rounded-full border border-border/60 bg-background/80 text-foreground hover:bg-background"
                                    >
                                        <Link href={`/exercises/${exercise.exerciseId}`}>
                                            View exercise
                                        </Link>
                                    </Button>
                                </div>

                                <CollapsibleContent className="border-t border-border/60 px-6 py-5">
                                    <ExerciseSets exercise={exercise} />
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    );
                })}
            </div>
        </section>
    );
}