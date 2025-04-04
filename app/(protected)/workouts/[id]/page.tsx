import { Container } from '@/src/components/common/container';

import { Card, CardContent } from '@/src/components/ui/card';
import { WorkoutExerciseList } from '@/src/components/workout/workout-exercise-list';
import DeleteWorkoutButton from '@/src/components/workout/delete-workout-button';
import { getWorkout } from '@/src/data/workout';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { MoveLeft, Pencil } from 'lucide-react';



export default async function WorkoutDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = await params.id;
    const workout = await getWorkout(id);

    if (!workout) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <p className="text-lg text-gray-600 dark:text-gray-400">Workout not found</p>
            </div>
        );
    }

    return (
        <Container>
            <div className="space-y-4 pb-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                    {workout.name || 'Unnamed Workout'}
                </h1>
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    {/* Back button */}
                    <Button asChild>
                        <Link href="/workouts">
                            <MoveLeft />
                            Back
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/workouts/${workout.id}/edit`}>
                            <Pencil /> Edit
                        </Link>
                    </Button>

                    <DeleteWorkoutButton workout={workout} />
                </div>
                <Card>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400">Date</h3>
                                <p className="text-gray-500 dark:text-gray-100">{new Date(workout.date).toLocaleDateString()}</p>
                            </div>
                            {workout.description && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Description</h3>
                                    <p className="text-gray-500 dark:text-gray-100 whitespace-pre-wrap">{workout.description}</p>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Muscle Group</h3>
                                <p className="text-gray-500 dark:text-gray-100">{workout.muscleGroupName}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {workout.totalWeight && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Total Weight</h3>
                                    <p className="text-gray-500 dark:text-gray-100">{workout.totalWeight} kg</p>
                                </div>
                            )}
                            {workout.totalReps && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Total Reps</h3>
                                    <p className="text-gray-500 dark:text-gray-100">{workout.totalReps}</p>
                                </div>
                            )}
                            {workout.totalSets && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Total Sets</h3>
                                    <p className="text-gray-500 dark:text-gray-100">{workout.totalSets}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-4">
                    <WorkoutExerciseList exercises={workout.exercises} />
                </div>
            </div>
        </Container>
    );
}