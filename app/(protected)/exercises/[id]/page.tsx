import Link from "next/link";

import { Container } from "@/src/components/common/container";
import { ExerciseDeleteButton } from "@/src/components/exercise/exercise-delete-button";
import { ExerciseTabs } from "@/src/components/exercise/exercise-tabs";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardTitle } from "@/src/components/ui/card";
import { getExercise } from "@/src/data/exercise";
import { getLogTypeInfo } from "@/src/utils/get-log-type-info";
import { Activity, LibraryBig, Lock, MoveLeft, Pencil, ShieldCheck, Target } from "lucide-react";

export default async function ExerciseDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = await params.id;
    const exercise = await getExercise(id);

    if (!exercise) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
                <Container>
                    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                        <Card className="border-0 shadow-overlay max-w-md w-full">
                            <CardContent className="text-center py-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-4 bg-destructive/10 rounded-full">
                                        <Activity className="h-8 w-8 text-destructive" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="type-heading-sm text-foreground">Exercise Not Found</h3>
                                        <p className="type-body-md text-muted-foreground">
                                            The exercise you&apos;re looking for doesn&apos;t exist or has been removed.
                                        </p>
                                    </div>
                                    <Button asChild className="mt-4">
                                        <Link href="/exercises">
                                            <MoveLeft className="mr-2 h-4 w-4" />
                                            Back to Exercises
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Container>
            </div>
        );
    }

    const logTypeInfo = getLogTypeInfo(exercise.exerciseLogType);
    const LogTypeIcon = logTypeInfo.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
            <Container>
                <div className="space-y-10 py-10">
                    <Button
                        asChild
                        variant="ghost"
                        className="w-fit rounded-full bg-background/60 px-4 py-2 text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/exercises" className="flex items-center gap-2">
                            <MoveLeft className="h-4 w-4" aria-hidden="true" />
                            Back to exercises
                        </Link>
                    </Button>

                    <section className="space-y-8 rounded-3xl border border-border/60 bg-card/95 p-6 shadow-card-rest lg:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                    <LibraryBig className="h-3.5 w-3.5" aria-hidden="true" />
                                    Exercise overview
                                </div>
                                <div className="space-y-3">
                                    <h1 className="type-heading-lg text-foreground flex flex-wrap items-center gap-3">
                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                            <Activity className="h-6 w-6" aria-hidden="true" />
                                        </span>
                                        {exercise.name || "Unnamed exercise"}
                                    </h1>
                                    <p className="max-w-2xl type-body-sm text-muted-foreground">
                                        Review the movement focus, log type, and recent performance history for this exercise.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {exercise.muscleGroupName ? (
                                        <Badge variant="secondary" className="flex items-center gap-2 rounded-full px-3 py-1 type-label tracking-normal uppercase">
                                            <Target className="h-3.5 w-3.5" aria-hidden="true" />
                                            {exercise.muscleGroupName}
                                        </Badge>
                                    ) : null}
                                    <Badge variant={logTypeInfo.variant} className="flex items-center gap-2 rounded-full px-3 py-1 type-label tracking-normal uppercase">
                                        <LogTypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                        {logTypeInfo.label}
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-2 rounded-full px-3 py-1 type-label tracking-normal uppercase">
                                        {exercise.isPublic ? (
                                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                        ) : (
                                            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                                        )}
                                        {exercise.isPublic ? "Community" : "Personal"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button asChild size="lg" variant="secondary" className="rounded-full">
                                    <Link href={`/exercises/${exercise.id}/edit`}>
                                        <Pencil className="mr-2 h-5 w-5" aria-hidden="true" />
                                        Edit exercise
                                    </Link>
                                </Button>
                                <ExerciseDeleteButton exercise={exercise} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl border border-border/60 bg-background/70 px-5 py-4">
                                <p className="type-label text-muted-foreground uppercase tracking-wide">Muscle focus</p>
                                <p className="mt-2 type-heading-sm text-foreground">{exercise.muscleGroupName ?? "Full body"}</p>
                                <p className="mt-1 type-body-sm text-muted-foreground">Primary muscle group tagged for this movement</p>
                            </div>
                            <div className="rounded-3xl border border-border/60 bg-background/70 px-5 py-4">
                                <p className="type-label text-muted-foreground uppercase tracking-wide">Log type</p>
                                <p className="mt-2 type-heading-sm text-foreground">{logTypeInfo.label}</p>
                                <p className="mt-1 type-body-sm text-muted-foreground">Determines the metrics captured when logging sets</p>
                            </div>
                            <div className="rounded-3xl border border-border/60 bg-background/70 px-5 py-4">
                                <p className="type-label text-muted-foreground uppercase tracking-wide">Visibility</p>
                                <p className="mt-2 type-heading-sm text-foreground">{exercise.isPublic ? "Shared" : "Private"}</p>
                                <p className="mt-1 type-body-sm text-muted-foreground">Control whether others can view this exercise template</p>
                            </div>
                        </div>

                        <Card className="border border-border/60 bg-background/80 shadow-none">
                            <CardContent className="space-y-3 p-6">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Activity className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <CardTitle className="type-heading-sm text-foreground">Technique notes</CardTitle>
                                        <p className="type-body-sm text-muted-foreground">Capture cues and setup reminders to stay consistent.</p>
                                    </div>
                                </div>
                                <p className="whitespace-pre-wrap type-body-sm text-muted-foreground">
                                    {exercise.description || "No notes yet. Use the edit action to add tips for yourself or your athletes."}
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <ExerciseTabs exerciseId={exercise.id} />
                </div>
            </Container>
        </div>
    );
}
