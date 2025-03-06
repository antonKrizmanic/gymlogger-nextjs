import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { IWorkout } from '@/src/Models/Domain/Workout';
import { WorkoutService } from '@/src/Api/Services/WorkoutService';
import { DetailButton } from '../Common/DetailButton';
import { EditButton } from '../Common/EditButton';
import { Card } from '../Common/Card';
import { DeleteButton } from '../Common/DeleteButton';

interface WorkoutCardProps {
    workout: IWorkout;
    onClick?: (workout: IWorkout) => void;
    onDelete?: (workout: IWorkout) => void;
    onDeleteComplete?: () => void;
}

export function WorkoutCard({ workout, onClick, onDelete, onDeleteComplete }: WorkoutCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/workouts/${workout.id}/edit`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const service = new WorkoutService();
            await service.deleteWorkout(workout.id);
            onDelete?.(workout);
            onDeleteComplete?.();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Failed to delete workout:', error);
            // You might want to show an error toast here
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {workout.name}
                    </h3>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {workout.description || ''}
                </div>
                
                <div className="mt-auto pt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {workout.totalSets || 0} sets
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {workout.totalReps || 0} reps
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {workout.totalWeight || 0} kg
                    </span>
                    <div className="flex gap-2">
                        <DetailButton onClick={() => {onClick?.(workout)}}/>
                        <EditButton onClick={handleEdit}/>
                        <DeleteButton onClick={handleDelete}/>                        
                    </div>
                </div>
            </Card>

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