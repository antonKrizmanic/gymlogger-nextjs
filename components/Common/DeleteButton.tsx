'use client';

import { ExerciseService } from "@/src/Api/Services/ExerciseService";
import { IExercise } from "@/src/Models/Domain/Exercise";
import { ActionButton } from "@/components/Common/ActionButton";
import { ConfirmationModal } from "@/components/Common/ConfirmationModal";
import { ErrorSnackbar, SuccessSnackbar } from "@/components/Common/Snackbar";
import { TrashIcon } from "@/components/Icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
    exercise: IExercise;
    onDelete?: () => void; // Optional callback when deletion is successful
}

export function DeleteButton({ exercise, onDelete }: DeleteButtonProps) {
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
            const service = new ExerciseService();
            await service.deleteExercise(exercise.id);
            setSuccess('Exercise deleted successfully');
            
            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
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
            <div className={cn(
            'border border-gray-300 dark:border-gray-700 p-1 w-full flex justify-center items-center',
            'hover:bg-gray-100 dark:hover:bg-slate-700',
            'cursor-pointer',
            'transition-colors'
        )}>
            <button
                onClick={handleDelete}
                className={cn(
                    'action-button p-1.5 rounded-md',
                    'text-gray-500 dark:text-gray-400',                    
                    'cursor-pointer'
                )}
            >
                <TrashIcon />
            </button>
        </div>

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
