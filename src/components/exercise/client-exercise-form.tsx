'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExerciseApiService } from '../../../src/api/services/exercise-api-service';
import { IExerciseCreate, IExerciseUpdate } from '@/src/models/domain/exercise';
import { ExerciseForm } from './exercise-form';
import { toast } from 'sonner';

interface ClientExerciseFormProps {
    title: string;
    exercise: IExerciseCreate;
    id?: string; // Optional id for edit mode
    cancelHref: string;
}

export function ClientExerciseForm({ title, exercise, id, cancelHref }: ClientExerciseFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: IExerciseCreate) => {
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
                toast.success('Exercise updated successfully!');
                router.push('/exercises')
            } else {
                // Create new exercise
                await service.createExercise(formData);
                toast.success('Exercise created successfully!');
                router.push('/exercises');
            }
        } catch (error) {
            console.error(`Failed to ${id ? 'update' : 'create'} exercise:`, error);
            toast.error(`Failed to ${id ? 'update' : 'create'} exercise. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ExerciseForm
            title={title}
            exercise={exercise}
            onSubmit={handleSubmit}
            cancelHref={cancelHref}
            isLoading={isLoading}
        />
    );
}