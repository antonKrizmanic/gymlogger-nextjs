import { IWorkoutSimple } from '@/src/Models/Domain/Workout';
import { WorkoutApiService } from '@/src/Api/Services/WorkoutApiService';
import { DetailButton } from '../Common/DetailButton';
import { EditButton } from '../Common/EditButton';
import { Card } from '../Common/Card';
import { DeleteButton } from '../Common/DeleteButton';

interface WorkoutCardProps {
    workout: IWorkoutSimple;    
    onDelete?: () => void;    
}

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {    

    const deleteAction = async () => {
        const service = new WorkoutApiService();
        await service.deleteWorkout(workout.id);
    }

    return (
        <>
            <Card>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {workout.name} <span className="text-sm text-gray-500 dark:text-gray-400">&nbsp;{new Date(workout.date).toLocaleDateString()}</span>
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
                </div>
                <div className="mt-auto flex justify-between items-center px-0">                                        
                    <DetailButton href={`/workouts/${workout.id}`}/>                    
                    <EditButton href={`/workouts/${workout.id}/edit`}/>
                    <DeleteButton 
                        entityName={workout.name || ''}
                        entityType="workout"                        
                        deleteAction={deleteAction}
                        onDelete={onDelete}/>
                </div>
            </Card>
        </>
    );
} 