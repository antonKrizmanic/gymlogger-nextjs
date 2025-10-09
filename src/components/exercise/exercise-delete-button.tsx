'use client';

import { ExerciseApiService } from '@/src/api/services/exercise-api-service';
import { DeleteButton } from '@/src/components/common/delete-button';
import { IExercise } from '@/src/models/domain/exercise';

interface ExerciseDeleteButtonProps {
    exercise: IExercise;
}

export function ExerciseDeleteButton({ exercise }: ExerciseDeleteButtonProps) {
    const deleteAction = async () => {
        const service = new ExerciseApiService();
        await service.deleteExercise(exercise.id);
    };

    return (
        <DeleteButton
            entityName={exercise.name}
            entityType="Exercise"
            deleteAction={deleteAction}
            className="w-auto px-6"
            size="lg"
            text="Delete exercise"
        />
    );
}
