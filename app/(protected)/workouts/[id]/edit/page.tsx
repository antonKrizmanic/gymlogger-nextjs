'use client';

import { Container } from '@/src/components/common/container';
import { ClientWorkoutForm } from '@/src/components/workout/client-workout-form';
import { IWorkoutCreate } from '@/src/models/domain/workout';
import { useEffect, useState } from 'react';
import { WorkoutApiService } from '@/src/api/services/workout-api-service';
import { useParams } from 'next/navigation';

export default function EditWorkoutPage() {
    const params = useParams();
    const id = params.id as string;
    const [workout, setWorkout] = useState<IWorkoutCreate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                setLoading(true);
                const workoutApiService = new WorkoutApiService();
                const data = await workoutApiService.getWorkout(id);
                
                const workoutCreate: IWorkoutCreate = {
                    name: data.name,
                    description: data.description,
                    date: data.date,
                    exercises: data.exercises
                };
                
                setWorkout(workoutCreate);
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
            <ClientWorkoutForm
                title="Edit Workout"
                workout={workout}
                id={id}
                cancelHref="/workouts"
            />
        </Container>
    );
}