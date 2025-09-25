'use client';

import { WorkoutApiService } from '@/src/api/services/workout-api-service';
import { DeleteButton } from '@/src/components/common/delete-button';
import { IWorkout } from '@/src/models/domain/workout';

interface WorkoutDeleteButtonProps {
    workout: IWorkout;
}

export function WorkoutDeleteButton({ workout }: WorkoutDeleteButtonProps) {
    const deleteAction = async () => {
        const service = new WorkoutApiService();
        await service.deleteWorkout(workout.id);
    };

    return (
        <DeleteButton
            entityName={workout.name || 'Untitled Workout'}
            entityType="Workout"
            deleteAction={deleteAction}
        />
    );
}
