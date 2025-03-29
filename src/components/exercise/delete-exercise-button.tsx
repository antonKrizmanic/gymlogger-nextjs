'use client';

import { ExerciseApiService } from "@/src/api/services/exercise-api-service";
import { IExercise } from "@/src/models/domain/exercise";
import { ConfirmationModal } from "@/src/components/common/confirmation-modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteExerciseButtonProps {
    exercise: IExercise;
    onDelete?: () => void; // Optional callback when deletion is successful
}

export default function DeleteExerciseButton({ exercise, onDelete }: DeleteExerciseButtonProps) {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);    

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            const service = new ExerciseApiService();
            await service.deleteExercise(exercise.id);            
            toast.success('Exercise deleted successfully');
            
            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
            } else {
                // Only redirect if no callback was provided
                router.push('/exercises');
            }
        } catch (err) {            
            toast.error(`Failed to delete exercise: ${err}`);
            console.error('Error deleting exercise:', err);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            <Button onClick={handleDelete}>
                <Trash /> Delete
            </Button>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Delete Exercise"
                message={`Are you sure you want to delete "${exercise.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsDeleteModalOpen(false)}
                isLoading={isDeleting}
            />            
        </>
    );
}