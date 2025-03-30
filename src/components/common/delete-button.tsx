'use client';
import { Button } from "@/src/components/ui/button"
import { ConfirmationModal } from "@/src/components/common/confirmation-modal";
import { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteButtonProps {
    entityName: string;
    entityType: string;
    onDelete?: () => void; // Optional callback when deletion is successful
    deleteAction: () => Promise<void>;
}

export function DeleteButton({ entityName, entityType, onDelete, deleteAction }: DeleteButtonProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);    

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await deleteAction();
            toast.success(`${entityType} deleted successfully`);

            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
            }
        } catch (err) {
            toast.error(`Failed to delete ${entityType}: ${err}`);
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
        </>
    );
}
