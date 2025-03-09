'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutService } from '@/src/Api/Services/WorkoutService';
import { IWorkoutCreate } from '@/src/Models/Domain/Workout';
import { SuccessSnackbar, ErrorSnackbar } from '@/components/Common/Snackbar';
import { WorkoutForm } from '@/components/Workout/WorkoutForm';
import { Container } from '@/components/Common/Container';

export default function CreateWorkoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessSnackbarVisible, setIsSuccessSnackbarVisible] = useState(false);
    const [isErrorSnackbarVisible, setIsErrorSnackbarVisible] = useState(false);
    const [formData,] = useState<IWorkoutCreate>({
        name: '',
        description: '',
        date: new Date(),
        exercises: []
    });

    const handleSubmit = async (workout: IWorkoutCreate) => {        
        setIsLoading(true);

        try {
            const service = new WorkoutService();
            await service.createWorkout(workout);
            setIsSuccessSnackbarVisible(true);
            router.push('/workouts');
        } catch (error) {
            console.error('Failed to create workout:', error);
            setIsErrorSnackbarVisible(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Container>
            <WorkoutForm
                title="Create New Workout"
                workout={formData}
                workoutId={null}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                cancelHref="/workouts"
            />

            <SuccessSnackbar
                text="Workout created successfully!"
                isVisible={isSuccessSnackbarVisible}
                onClose={() => setIsSuccessSnackbarVisible(false)}
            />
            <ErrorSnackbar
                text="Workout creation failed!"
                isVisible={isErrorSnackbarVisible}
                onClose={() => setIsErrorSnackbarVisible(false)}
            />
        </Container>
    );
} 