import { Container } from "@/src/components/common/container";
import { ExerciseDeleteButton } from "@/src/components/exercise/exercise-delete-button";
import { ExerciseTabs } from "@/src/components/exercise/exercise-tabs";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getExercise } from "@/src/data/exercise";
import { getLogTypeInfo } from "@/src/utils/get-log-type-info";
import { Activity, MoveLeft, Pencil, Target } from "lucide-react";
import Link from "next/link";

export default async function ExerciseDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = await params.id;
    const exercise = await getExercise(id);

    if (!exercise) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
                <Container>
                    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                        <Card className="border-0 shadow-xl max-w-md w-full">
                            <CardContent className="text-center py-12">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-4 bg-destructive/10 rounded-full">
                                        <Activity className="h-8 w-8 text-destructive" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-foreground">Exercise Not Found</h3>
                                        <p className="text-muted-foreground">
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
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            <Container>
                {/* Hero Section */}
                <div className="space-y-6 pb-8">
                    <div className="space-y-4">
                        {/* Back Navigation */}
                        <Button asChild variant="ghost" className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground">
                            <Link href="/exercises" className="flex items-center gap-2">
                                <MoveLeft className="h-4 w-4" />
                                Back to Exercises
                            </Link>
                        </Button>

                        {/* Exercise Title & Badges */}
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground flex items-center">
                                <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                    <Activity className="h-8 w-8 text-primary" />
                                </div>
                                {exercise.name || 'Unnamed Exercise'}
                            </h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3">
                                {exercise.muscleGroupName && (
                                    <Badge variant="secondary" className="text-sm px-3 py-1 flex items-center gap-2">
                                        <Target className="h-4 w-4" />
                                        {exercise.muscleGroupName}
                                    </Badge>
                                )}
                                <Badge variant={logTypeInfo.variant} className="text-sm px-3 py-1 flex items-center gap-2">
                                    <LogTypeIcon className="h-4 w-4" />
                                    {logTypeInfo.label}
                                </Badge>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button asChild size="lg" className="px-6 py-3 text-lg font-semibold">
                                <Link href={`/exercises/${exercise.id}/edit`}>
                                    <Pencil className="mr-2 h-5 w-5" />
                                    Edit Exercise
                                </Link>
                            </Button>
                            <ExerciseDeleteButton exercise={exercise} />
                        </div>
                    </div>
                </div>

                {/* Exercise Details Card */}
                {exercise.description && (
                    <Card className="border-0 shadow-lg mb-8">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-foreground flex items-center">
                                <Activity className="mr-2 h-6 w-6 text-primary" />
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {exercise.description}
                            </p>
                        </CardContent>
                    </Card>
                )}


                {/* Tabbed interface for history and progress */}
                <ExerciseTabs exerciseId={exercise.id} />
            </Container>
        </div>
    );
}
