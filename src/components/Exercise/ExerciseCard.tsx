'use client';

import { IExercise } from '@/src/Models/Domain/Exercise';
import { DetailButton } from '../Common/DetailButton';
import { EditButton } from '../Common/EditButton';
import { DeleteButton } from '../Common/DeleteButton';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '../ui/card';
import { ExerciseApiService } from '@/src/Api/Services/ExerciseApiService';

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
                    entityType="exercise"
                    deleteAction={deleteAction}
                    onDelete={onDelete} /></div>
                
                
                
            </CardFooter>
        </Card>
    );
}