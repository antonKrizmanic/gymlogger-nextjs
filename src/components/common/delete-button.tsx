'use client';
import { useState } from "react";

import { ConfirmationModal } from "@/src/components/common/confirmation-modal";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface DeleteButtonProps {
    entityName: string;
    entityType: string;
    onDelete?: () => void; // Optional callback when deletion is successful
    deleteAction: () => Promise<void>;
    className?: string;
    size?: "default" | "sm" | "lg";
    text?: string;
    appearance?: "soft" | "solid";
}

export function DeleteButton({
    entityName,
    entityType,
    onDelete,
    deleteAction,
    className,
    size = "default",
    text,
    appearance = "soft",
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

    const softAppearanceClasses =
        "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/30";

    return (
        <>
            <Button
                type="button"
                onClick={handleDelete}
                size={size}
                disabled={isDeleting}
                aria-busy={isDeleting}
                variant={appearance === "solid" ? "destructive" : "ghost"}
                className={cn(
                    "motion-base flex w-full items-center justify-center gap-2 rounded-full px-4",
                    appearance === "soft" && softAppearanceClasses,
                    className,
                )}
            >
                <Trash className="h-4 w-4" aria-hidden="true" />
                <span>{text ?? "Delete"}</span>
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
