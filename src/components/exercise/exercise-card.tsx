'use client';

import { IExercise } from '@/src/models/domain/exercise';
import { DetailButton } from '../common/detail-button';
import { EditButton } from '../common/edit-button';
import { DeleteButton } from '../common/delete-button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '../ui/card';
import { ExerciseApiService } from '@/src/api/services/exercise-api-service';

interface ExerciseCardProps {
    exercise: IExercise;
    onDelete: () => void;
}

export function ExerciseCard({ exercise, onDelete }: ExerciseCardProps) {

    const deleteAction = async () => {
        const service = new ExerciseApiService();
        await service.deleteExercise(exercise.id);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
                <CardDescription>{exercise.muscleGroupName}</CardDescription>
            </CardHeader>
            <CardContent>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exercise.description}
                </span>
            </CardContent>

            <CardFooter className="flex justify-between gap-2">
                <div className="w-1/3"><DetailButton href={`/exercises/${exercise.id}`} /></div>
                <div className="w-1/3"><EditButton href={`/exercises/${exercise.id}/edit`} /></div>
                <div className="w-1/3"><DeleteButton
                    entityName={exercise.name}
                    entityType="Exercise"
                    deleteAction={deleteAction}
                    onDelete={onDelete} /></div>
                
                
                
            </CardFooter>
        </Card>
    );
}