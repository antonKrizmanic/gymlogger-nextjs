'use client';

import { use } from "react";

import { IExercise } from "@/src/Models/Domain/Exercise";
import { useState } from "react";

import { useEffect } from "react";
import { ExerciseService } from "@/src/Api/Services/ExerciseService";
import { ErrorSnackbar, SuccessSnackbar } from "@/components/Common/Snackbar";
import { ConfirmationModal } from "@/components/Common/ConfirmationModal";
import { Container } from "@/components/Common/Container";
import { useRouter } from "next/navigation";
import { ActionButton } from "@/components/Common/ActionButton";
import { LeftArrowIcon, PencilIcon, TrashIcon } from "@/components/Icons";

type ExerciseDetailPageProps = Promise<{
    id: string;
}>

export default function ExerciseDetailPage(props: {params: Promise<ExerciseDetailPageProps>}) {
    const params = use(props.params);
    const id = params.id;
    const router = useRouter();

    const [exercise, setExercise] = useState<IExercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try{
                const service = new ExerciseService();
                const exercise = await service.getExercise(id);
                setExercise(exercise);
            } catch (err) {
                setError('Failed to load exercise details');
                console.error('Error fetching exercise:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[id]);

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!exercise) return;

        setIsDeleting(true);
        try {
            const workoutService = new ExerciseService();
            await workoutService.deleteExercise(exercise.id);
            setSuccess('Exercise deleted successfully');
            router.push('/exercises');
        } catch (err) {
            setError('Failed to delete exercise');
            console.error('Error deleting exercise:', err);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <p className="text-lg text-gray-600 dark:text-gray-400">Workout not found</p>
            </div>
        );
    }

    return(
        <>
            <Container>
            <div className="space-y-4 pb-4">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">{exercise.name || 'Unnamed Exercise'}</h1>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 ">
                        {/* Back button */}
                        <ActionButton href="/exercises">
                            <LeftArrowIcon />
                            Back
                        </ActionButton>                        
                        <ActionButton href={`/exercises/${exercise.id}/edit`}>
                            <PencilIcon /> Edit
                        </ActionButton>
                        <ActionButton onClick={handleDelete}>
                            <TrashIcon /> Delete
                        </ActionButton>
                    </div>
                </div>
            </Container>

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
