'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutApiService } from '@/src/Api/Services/WorkoutApiService';
import { IWorkoutCreate, IWorkoutUpdate } from '@/src/Models/Domain/Workout';
import { WorkoutForm } from './WorkoutForm';
import { ErrorSnackbar, SuccessSnackbar } from '../Common/Snackbar';

interface ClientWorkoutFormProps {
    title: string;
    workout: IWorkoutCreate;
    id?: string; // Optional id for edit mode
    cancelHref: string;
}

export function ClientWorkoutForm({ title, workout, id, cancelHref }: ClientWorkoutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessSnackbarVisible, setIsSuccessSnackbarVisible] = useState(false);
    const [isErrorSnackbarVisible, setIsErrorSnackbarVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (formData: IWorkoutCreate) => {
        // Basic validation
        if (!formData.name || !formData.date) {
            setErrorMessage('Name and date are required');
            setIsErrorSnackbarVisible(true);
            return;
        }

        setIsLoading(true);

        try {
            const service = new WorkoutApiService();
            
            if (id) {
                // Update existing workout
                const updateData: IWorkoutUpdate = {
                    ...formData,
                    id
                };
                await service.updateWorkout(id, updateData);
                setIsSuccessSnackbarVisible(true);                
                router.push('/workouts')
            } else {
                // Create new workout
                await service.createWorkout(formData);
                setIsSuccessSnackbarVisible(true);
                router.push('/workouts');
            }
        } catch (error) {
            console.error(`Failed to ${id ? 'update' : 'create'} workout:`, error);
            setErrorMessage(`Failed to ${id ? 'update' : 'create'} workout. Please try again.`);
            setIsErrorSnackbarVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeErrorSnackbar = () => {
        setIsErrorSnackbarVisible(false);
        setErrorMessage('');
    };

    return (
        <>
            <WorkoutForm
                workoutId={id || null}
                title={title}
                workout={workout}
                onSubmit={handleSubmit}
                cancelHref={cancelHref}
                isLoading={isLoading}
            />
            
            <SuccessSnackbar
                text={`Workout ${id ? 'updated' : 'created'} successfully!`}
                isVisible={isSuccessSnackbarVisible}
                onClose={() => setIsSuccessSnackbarVisible(false)}
            />
            
            <ErrorSnackbar
                text={errorMessage || `Workout ${id ? 'update' : 'creation'} failed!`}
                isVisible={isErrorSnackbarVisible}
                onClose={closeErrorSnackbar}
            />
        </>
    );
}
