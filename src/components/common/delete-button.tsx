'use client';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmationModal } from '@/src/components/common/confirmation-modal';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';

interface DeleteButtonProps {
    entityName: string;
    entityType: string;
    onDelete?: () => void; // Optional callback when deletion is successful
    deleteAction: () => Promise<void>;
    className?: string;
    size?: 'default' | 'sm' | 'lg';
    text?: string;
}

export function DeleteButton({
    entityName,
    entityType,
    onDelete,
    deleteAction,
    className,
    size = 'default',
    text,
}: DeleteButtonProps) {
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
                size={size}
                className={cn('rounded-1 w-full', className)}
            >
                <Trash />
                {text}
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
