'use client';

import { use, useEffect, useState } from 'react';
import { WorkoutService } from '@/src/Api/Services/WorkoutService';
import { IWorkout } from '@/src/Models/Domain/Workout';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Common/Card';
import { ConfirmationModal } from '@/components/Common/ConfirmationModal';
import { SuccessSnackbar } from '@/components/Common/Snackbar';
import { ErrorSnackbar } from '@/components/Common/Snackbar';
import { Container } from '@/components/ui/Container';
import { WorkoutExerciseList } from '@/components/Workout/WorkoutExerciseList';
import { ExerciseWorkoutService } from '@/src/Api/Services/ExerciseWorkoutService';
import { IExerciseWorkout } from '@/src/Models/Domain/Workout';
import { SortDirection } from '@/src/Types/Enums';
import { PencilIcon, TrashIcon } from '@/components/Icons';
import { ActionButton } from '@/components/Common/ActionButton';

type WorkoutDetailPageProps = Promise<{
        id: string;
}>

export default function WorkoutDetailPage(props: {params: WorkoutDetailPageProps}) {
    const params = use(props.params);
    const id = params.id;
    const router = useRouter();
    const [workout, setWorkout] = useState<IWorkout | null>(null);
    const [exercises, setExercises] = useState<IExerciseWorkout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workoutService = new WorkoutService();
                const exerciseWorkoutService = new ExerciseWorkoutService();

                const [workoutData, exercisesResponse] = await Promise.all([
                    workoutService.getWorkout(id),
                    exerciseWorkoutService.getExerciseWorkouts({
                        workoutId: id,
                        exerciseId: null,
                        page: 0,
                        pageSize: 100,
                        sortColumn: 'index',
                        sortDirection: SortDirection.Ascending
                    })
                ]);

                setWorkout(workoutData);
                setExercises(exercisesResponse.items || []);
                console.log(exercisesResponse.items);
            } catch (err) {
                setError('Failed to load workout details');
                console.error('Error fetching workout:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!workout) return;

        setIsDeleting(true);
        try {
            const workoutService = new WorkoutService();
            await workoutService.deleteWorkout(workout.id);
            setSuccess('Workout deleted successfully');
            router.push('/workouts');
        } catch (err) {
            setError('Failed to delete workout');
            console.error('Error deleting workout:', err);
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

    if (!workout) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <p className="text-lg text-gray-600 dark:text-gray-400">Workout not found</p>
            </div>
        );
    }

    return (
        <>
            <Container>
                <div className="space-y-4 pb-4">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">{workout.name || 'Unnamed Workout'}</h1>
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 ">
                        {/* Back button */}
                        <ActionButton href="/workouts">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </ActionButton>                        
                        <ActionButton href={`/workouts/${workout.id}/edit`}>
                            <PencilIcon /> Edit
                        </ActionButton>
                        <ActionButton onClick={handleDelete}>
                            <TrashIcon /> Delete
                        </ActionButton>
                    </div>
                </div>

                <Card>
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400">Date</h3>
                                <p className="text-gray-500 dark:text-gray-100">{new Date(workout.date).toLocaleDateString()}</p>
                            </div>
                            {workout.description && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Description</h3>
                                    <p className="text-gray-500 dark:text-gray-100 whitespace-pre-wrap">{workout.description}</p>
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Muscle Group</h3>
                                <p className="text-gray-500 dark:text-gray-100">{workout.muscleGroupName}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {workout.totalWeight && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Total Weight</h3>
                                    <p className="text-gray-500 dark:text-gray-100">{workout.totalWeight} kg</p>
                                </div>
                            )}
                            {workout.totalReps && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Total Reps</h3>
                                    <p className="text-gray-500 dark:text-gray-100">{workout.totalReps}</p>
                                </div>
                            )}
                            {workout.totalSets && (
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">Total Sets</h3>
                                    <p className="text-gray-500 dark:text-gray-100">{workout.totalSets}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="mt-4">
                    <WorkoutExerciseList exercises={exercises} />
                </div>
            </Container>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Delete Workout"
                message={`Are you sure you want to delete "${workout.name}"? This action cannot be undone.`}
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