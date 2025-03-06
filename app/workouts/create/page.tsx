'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutService } from '@/src/Api/Services/WorkoutService';
import { IWorkoutCreate, IExerciseWorkoutCreate } from '@/src/Models/Domain/Workout';
import { cn } from '@/lib/utils';
import { SuccessSnackbar, ErrorSnackbar } from '@/components/Common/Snackbar';
import { ExerciseList } from '@/components/Workout/ExerciseList';
import { WorkoutForm } from '@/components/Workout/WorkoutForm';

export default function CreateWorkoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessSnackbarVisible, setIsSuccessSnackbarVisible] = useState(false);
    const [isErrorSnackbarVisible, setIsErrorSnackbarVisible] = useState(false);
    const [formData, setFormData] = useState<IWorkoutCreate>({
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

    const handleCancel = () => {
        router.push('/workouts');
    };    

    return (
        <>
            <WorkoutForm
                title="Create New Workout"
                workout={formData}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
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
        </>
    );
} 