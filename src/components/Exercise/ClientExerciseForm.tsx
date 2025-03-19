'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExerciseApiService } from '@/src/Api/Services/ExerciseApiService';
import { IExerciseCreate, IExerciseUpdate } from '@/src/Models/Domain/Exercise';
import { ExerciseForm } from './ExerciseForm';
import { ErrorSnackbar, SuccessSnackbar } from '../Common/Snackbar';

interface ClientExerciseFormProps {
    title: string;
    exercise: IExerciseCreate;
    id?: string; // Optional id for edit mode
    cancelHref: string;
}

export function ClientExerciseForm({ title, exercise, id, cancelHref }: ClientExerciseFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessSnackbarVisible, setIsSuccessSnackbarVisible] = useState(false);
    const [isErrorSnackbarVisible, setIsErrorSnackbarVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (formData: IExerciseCreate) => {
        // Basic validation
        if (!formData.name || !formData.muscleGroupId) {
            setErrorMessage('Name and muscle group are required');
            setIsErrorSnackbarVisible(true);
            return;
        }

        setIsLoading(true);

        try {
            const service = new ExerciseApiService();
            
            if (id) {
                // Update existing exercise
                const updateData: IExerciseUpdate = {
                    ...formData,
                    id
                };
                await service.updateExercise(id, updateData);
                setIsSuccessSnackbarVisible(true);                
                router.push('/exercises')
            } else {
                // Create new exercise
                await service.createExercise(formData);
                setIsSuccessSnackbarVisible(true);
                router.push('/exercises');
            }
        } catch (error) {
            console.error(`Failed to ${id ? 'update' : 'create'} exercise:`, error);
            setErrorMessage(`Failed to ${id ? 'update' : 'create'} exercise. Please try again.`);
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
            <ExerciseForm
                title={title}
                exercise={exercise}
                onSubmit={handleSubmit}
                cancelHref={cancelHref}
                isLoading={isLoading}
            />
            
            <SuccessSnackbar
                text={`Exercise ${id ? 'updated' : 'created'} successfully!`}
                isVisible={isSuccessSnackbarVisible}
                onClose={() => setIsSuccessSnackbarVisible(false)}
            />
            
            <ErrorSnackbar
                text={errorMessage || `Exercise ${id ? 'update' : 'creation'} failed!`}
                isVisible={isErrorSnackbarVisible}
                onClose={closeErrorSnackbar}
            />
        </>
    );
}