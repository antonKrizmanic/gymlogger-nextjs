'use client';

import { IExercise } from '@/src/Models/Domain/Exercise';
import { DetailButton } from '../Common/DetailButton';
import { EditButton } from '../Common/EditButton';
import { DeleteButton } from '../Common/DeleteButton';
import { Card } from '../Common/Card';

interface ExerciseCardProps {
    exercise: IExercise;    
    onDelete: () => void;    
}

export function ExerciseCard({ exercise, onDelete }: ExerciseCardProps) {
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
                    <DeleteButton exercise={exercise} onDelete={onDelete}/>
                </div>
            </Card>            
        </>
    );
}