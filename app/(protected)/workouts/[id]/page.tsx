import { Container } from '@/src/components/common/container';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { WorkoutDeleteButton } from '@/src/components/workout/workout-delete-button';
import { WorkoutExerciseList } from '@/src/components/workout/workout-exercise-list';
import { getWorkout } from '@/src/data/workout';
import { format } from 'date-fns';
import { Activity, Calendar, Dumbbell, MoveLeft, Pencil, Target } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export default async function WorkoutDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = await params.id;
    const workout = await getWorkout(id);

    if (!workout) {
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
                                        <h3 className="text-xl font-semibold text-foreground">Workout Not Found</h3>
                                        <p className="text-muted-foreground">
                                            The workout you&apos;re looking for doesn&apos;t exist or has been removed.
                                        </p>
                                    </div>
                                    <Button asChild className="mt-4">
                                        <Link href="/workouts">
                                            <MoveLeft className="mr-2 h-4 w-4" />
                                            Back to Workouts
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

    const formatWorkoutDate = (date: string | Date) => {
        try {
            const workoutDate = new Date(date);
            return format(workoutDate, 'PPP'); // e.g., "December 25, 2023"
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            <Container>
                {/* Hero Section */}
                <div className="space-y-6 pb-8">
                    <div className="space-y-4">
                        {/* Back Navigation */}
                        <Button asChild variant="ghost" className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground">
                            <Link href="/workouts" className="flex items-center gap-2">
                                <MoveLeft className="h-4 w-4" />
                                Back to Workouts
                            </Link>
                        </Button>

                        {/* Workout Title & Info */}
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground flex items-center">
                                <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                    <Activity className="h-8 w-8 text-primary" />
                                </div>
                                {workout.name || 'Unnamed Workout'}
                            </h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="secondary" className="text-sm px-3 py-1 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatWorkoutDate(workout.date)}
                                </Badge>
                                {workout.muscleGroupName && (
                                    <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-2">
                                        <Target className="h-4 w-4" />
                                        {workout.muscleGroupName}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button asChild size="lg" className="px-6 py-3 text-lg font-semibold">
                                <Link href={`/workouts/${workout.id}/edit`}>
                                    <Pencil className="mr-2 h-5 w-5" />
                                    Edit Workout
                                </Link>
                            </Button>
                            <WorkoutDeleteButton workout={workout} />
                        </div>
                    </div>
                </div>

                {/* Workout Stats */}
                <Card className="border-0 shadow-lg mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-foreground flex items-center">
                            <Dumbbell className="mr-2 h-6 w-6 text-primary" />
                            Workout Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {workout.totalSets || 0}
                                </div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                                    Total Sets
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {workout.totalReps || 0}
                                </div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                                    Total Reps
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {workout.totalWeight || 0}
                                </div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                                    Total Weight (KG)
                                </div>
                            </div>
                        </div>

                        {workout.description && (
                            <div className="mt-6 pt-6 border-t border-muted">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                    Notes
                                </h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {workout.description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Exercise List */}
                <WorkoutExerciseList exercises={workout.exercises} />
            </Container>
        </div>
    );
}