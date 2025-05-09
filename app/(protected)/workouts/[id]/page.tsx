'use client';

import { Container } from '@/src/components/common/container';
import { Card, CardContent } from '@/src/components/ui/card';
import { WorkoutExerciseList } from '@/src/components/workout/workout-exercise-list';
import DeleteWorkoutButton from '@/src/components/workout/delete-workout-button';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { MoveLeft, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WorkoutApiService } from '@/src/api/services/workout-api-service';
import { IWorkout } from '@/src/models/domain/workout';
import { useParams } from 'next/navigation';

export default function WorkoutDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [workout, setWorkout] = useState<IWorkout | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                setLoading(true);
                const workoutApiService = new WorkoutApiService();
                const data = await workoutApiService.getWorkout(id);
                setWorkout(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching workout:', err);
                setError('Failed to load workout');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWorkout();
        }
    }, [id]);

    if (loading) {
        return (
            <Container>
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Container>
        );
    }

    if (error || !workout) {
        return (
            <Container>
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {error || 'Workout not found'}
                    </p>
                </div>
            </Container>
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