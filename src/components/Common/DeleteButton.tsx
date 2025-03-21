'use client';
import { Button } from "@/src/components/ui/button"
import { ConfirmationModal } from "@/src/components/Common/ConfirmationModal";
import { ErrorSnackbar, SuccessSnackbar } from "@/src/components/Common/Snackbar";
import { useState } from "react";
import { Trash } from "lucide-react";

interface DeleteButtonProps {
    entityName: string;
    entityType: string;
    onDelete?: () => void; // Optional callback when deletion is successful
    deleteAction: () => Promise<void>;
}

export function DeleteButton({ entityName, entityType, onDelete, deleteAction }: DeleteButtonProps) {
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
            await deleteAction();
            setSuccess(`${entityType} deleted successfully`);
            
            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
            }
        } catch (err) {
            setError(`Failed to delete ${entityType}`);
            console.error(`Error deleting ${entityType}:`, err);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            
            <Button
                onClick={handleDelete}                 
                className="rounded-1 w-full"
            >
                <Trash />
            </Button>
        

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title={`Delete ${entityType}`}
                message={`Are you sure you want to delete "${entityName}"? This action cannot be undone.`}
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
