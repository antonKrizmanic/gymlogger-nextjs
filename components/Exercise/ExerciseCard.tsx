'use client';

import { useState } from 'react';
import { IExercise } from '@/src/Models/Domain/Exercise';
import { ConfirmationModal } from '../Common/ConfirmationModal';
import { ExerciseService } from '@/src/Api/Services/ExerciseService';
import { DetailButton } from '../Common/DetailButton';
import { EditButton } from '../Common/EditButton';
import { DeleteButton } from '../Common/DeleteButton';
import { Card } from '../Common/Card';

interface ExerciseCardProps {
    exercise: IExercise;    
    onDelete?: (exercise: IExercise) => void;
    onDeleteComplete?: () => void;
}

export function ExerciseCard({ exercise, onDelete, onDeleteComplete }: ExerciseCardProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            const service = new ExerciseService();
            await service.deleteExercise(exercise.id);
            onDelete?.(exercise);
            onDeleteComplete?.();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Failed to delete exercise:', error);
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
                        {exercise.name}
                    </h3>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {exercise.description || 'No description available'}
                </div>
                
                <div className="mt-auto pt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {exercise.muscleGroupName}
                    </span>                    
                </div>
                <div className="mt-auto flex justify-between items-center px-0">                                        
                    <DetailButton href={`/exercises/${exercise.id}`}/>                    
                    <EditButton href={`/exercises/${exercise.id}/edit`}/>
                    <DeleteButton onClick={handleDelete}/>
                </div>
            </Card>

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