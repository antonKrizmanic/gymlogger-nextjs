'use client';

import { ExerciseApiService } from "@/src/Api/Services/ExerciseApiService";
import { IExercise } from "@/src/Models/Domain/Exercise";
import { ConfirmationModal } from "@/src/components/Common/ConfirmationModal";
import { ErrorSnackbar, SuccessSnackbar } from "@/src/components/Common/Snackbar";
import { TrashIcon } from "@/src/components/Icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

interface DeleteExerciseButtonProps {
    exercise: IExercise;
    onDelete?: () => void; // Optional callback when deletion is successful
}

export default function DeleteExerciseButton({ exercise, onDelete }: DeleteExerciseButtonProps) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            const service = new ExerciseApiService();
            await service.deleteExercise(exercise.id);
            setSuccess('Exercise deleted successfully');
            
            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
            } else {
                // Only redirect if no callback was provided
                router.push('/exercises');
            }
        } catch (err) {
            setError('Failed to delete exercise');
            console.error('Error deleting exercise:', err);
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
                title="Delete Exercise"
                message={`Are you sure you want to delete "${exercise.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalOpen(false)}
                isLoading={isDeleting}
            />

            <SuccessSnackbar
                text={success || ''}
                isVisible={!!success}
                onClose={() => setSuccess(null)}
            />
            <ErrorSnackbar
                text={error || ''}
                isVisible={!!error}
                onClose={() => setError(null)}
            />
        </>
    );
}