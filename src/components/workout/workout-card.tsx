import { format } from 'date-fns';
import { Calendar, Eye, Pencil, Target } from 'lucide-react';
import { WorkoutApiService } from '@/src/api/services/workout-api-service';
import type { IWorkoutSimple } from '@/src/models/domain/workout';
import { DeleteButton } from '../common/delete-button';
import { IconLinkButton } from '../common/icon-link-button';
import { Badge } from '../ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';

interface WorkoutCardProps {
    workout: IWorkoutSimple;
    onDelete?: () => void;
}

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
    const deleteAction = async () => {
        const service = new WorkoutApiService();
        await service.deleteWorkout(workout.id);
    };

    const formatWorkoutDate = (date: string | Date) => {
        try {
            const workoutDate = new Date(date);
            return format(workoutDate, 'PPP'); // e.g., "December 25, 2023"
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-foreground mb-3">
                            {workout.name || 'Untitled Workout'}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <CardDescription className="text-sm text-muted-foreground">
                                {formatWorkoutDate(workout.date)}
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {workout.muscleGroupName && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs flex items-center gap-1"
                                >
                                    <Target className="h-3 w-3" />
                                    {workout.muscleGroupName}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Workout Stats */}
                <div className="grid grid-cols-3 gap-4 py-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                            {workout.totalSets || 0}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Sets
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                            {workout.totalReps || 0}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            Reps
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                            {workout.totalWeight || 0}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                            KG
                        </div>
                    </div>
                </div>

                {/* Description */}
                {workout.description && (
                    <div className="pt-2 border-t border-muted">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {workout.description}
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-4 gap-2">
                <div className="flex-1">
                    <IconLinkButton
                        href={`/workouts/${workout.id}`}
                        icon={<Eye />}
                        aria-label="View workout"
                    />
                </div>
                <div className="flex-1">
                    <IconLinkButton
                        href={`/workouts/${workout.id}/edit`}
                        icon={<Pencil />}
                        aria-label="Edit workout"
                    />
                </div>
                <div className="flex-1">
                    <DeleteButton
                        entityName={workout.name || 'Untitled Workout'}
                        entityType="Workout"
                        deleteAction={deleteAction}
                        onDelete={onDelete}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
