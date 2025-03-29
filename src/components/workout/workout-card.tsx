import { IWorkoutSimple } from '@/src/models/domain/workout';
import { WorkoutApiService } from '@/src/api/services/workout-api-service';
import { DetailButton } from '../common/detail-button';
import { EditButton } from '../common/edit-button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '../ui/card';
import { DeleteButton } from '../common/delete-button';

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
        <Card>
            <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription>{new Date(workout.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                {workout.description || ''}
                <div className="flex justify-between">
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
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
                <div className="w-1/3">
                    <DetailButton href={`/workouts/${workout.id}`} />
                </div>
                <div className="w-1/3">
                    <EditButton href={`/workouts/${workout.id}/edit`} />
                </div>
                <div className="w-1/3">
                <DeleteButton
                    entityName={workout.name || ''}
                    entityType="Workout"
                    deleteAction={deleteAction}
                    onDelete={onDelete} />
                </div>                
            </CardFooter>
        </Card>
    );
} 