'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutApiService } from '@/src/Api/Services/WorkoutApiService';
import { IWorkout } from '@/src/Models/Domain/Workout';
import { ActionButton } from '@/src/components/Common/ActionButton';
import { ConfirmationModal } from '@/src/components/Common/ConfirmationModal';
import { TrashIcon } from '@/src/components/Icons';

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
            <ActionButton onClick={handleDelete}>
                <TrashIcon /> Delete
            </ActionButton>
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
