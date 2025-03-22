'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { WorkoutApiService } from '@/src/Api/Services/WorkoutApiService';
import { IWorkoutCreate, IWorkoutUpdate } from '@/src/Models/Domain/Workout';
import { WorkoutForm } from './WorkoutForm';

interface ClientWorkoutFormProps {
    title: string;
    workout: IWorkoutCreate;
    id?: string; // Optional id for edit mode
    cancelHref: string;
}

export function ClientWorkoutForm({ title, workout, id, cancelHref }: ClientWorkoutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: IWorkoutCreate) => {
        // Basic validation
        if (!formData.name || !formData.date) {
            toast.error('Name and date are required');
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
                toast.success('Workout updated successfully!');
                router.push('/workouts')
            } else {
                // Create new workout
                await service.createWorkout(formData);

                toast.success('Workout created successfully!');
                router.push('/workouts');
            }
        } catch (error) {
            console.error(`Failed to ${id ? 'update' : 'create'} workout:`, error);
            toast.error(`Failed to ${id ? 'update' : 'create'} workout. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <WorkoutForm
            workoutId={id || null}
            title={title}
            workout={workout}
            onSubmit={handleSubmit}
            cancelHref={cancelHref}
            isLoading={isLoading}
        />
    );
}
