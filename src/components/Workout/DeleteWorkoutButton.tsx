'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutApiService } from '@/src/Api/Services/WorkoutApiService';
import { IWorkout } from '@/src/Models/Domain/Workout';
import { ConfirmationModal } from '@/src/components/Common/ConfirmationModal';
import { TrashIcon } from '@/src/components/Icons';
import { Button } from '../ui/button';

interface DeleteWorkoutButtonProps {
    workout: IWorkout;
}

export default function DeleteWorkoutButton({ workout }: DeleteWorkoutButtonProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            const workoutService = new WorkoutApiService();
            await workoutService.deleteWorkout(workout.id);
            router.push('/workouts');
        } catch (error) {
            console.error('Failed to delete workout:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            <Button onClick={handleDelete}>
                <TrashIcon /> Delete
            </Button>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Delete Workout"
                message={`Are you sure you want to delete "${workout.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalOpen(false)}
                isLoading={isDeleting}
            />
        </>
    );
}
