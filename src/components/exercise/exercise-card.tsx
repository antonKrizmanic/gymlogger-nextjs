'use client';

import { ExerciseApiService } from '@/src/api/services/exercise-api-service';
import { IExercise } from '@/src/models/domain/exercise';
import { ExerciseLogType } from '@/src/types/enums';
import { getLogTypeInfo } from '@/src/utils/get-log-type-info';
import { Activity, Clock, Eye, Pencil, Repeat, Weight } from 'lucide-react';
import { DeleteButton } from '../common/delete-button';
import { IconLinkButton } from '../common/icon-link-button';
import { Badge } from '../ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';

interface ExerciseCardProps {
    exercise: IExercise;
    onDelete: () => void;
}

// Using shared helper getLogTypeInfo

export function ExerciseCard({ exercise, onDelete }: ExerciseCardProps) {
    const deleteAction = async () => {
        const service = new ExerciseApiService();
        await service.deleteExercise(exercise.id);
    };

    const logTypeInfo = getLogTypeInfo(exercise.exerciseLogType);
    const LogTypeIcon = logTypeInfo.icon;

    return (
        <Card className="border-2 bg-gradient-to-br from-card to-card/80 transition-all duration-300 hover:shadow-card-hover focus-visible:shadow-card-hover active:shadow-card-pressed hover:-translate-y-1">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="type-heading-sm text-foreground mb-2">
                            {exercise.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                            {exercise.muscleGroupName && (
                                <Badge variant="secondary" className="type-body-sm">
                                    {exercise.muscleGroupName}
                                </Badge>
                            )}
                            <Badge variant={logTypeInfo.variant} className="type-body-sm flex items-center gap-1">
                                <LogTypeIcon className="h-3 w-3" />
                                {logTypeInfo.label}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {exercise.description && (
                <CardContent>
                    <p className="type-body-sm text-muted-foreground">
                        {exercise.description}
                    </p>
                </CardContent>
            )}

            <CardFooter className="pt-4 gap-2">
                <div className="flex-1">
                    <IconLinkButton href={`/exercises/${exercise.id}`} icon={<Eye />} aria-label="View exercise" />
                </div>
                <div className="flex-1">
                    <IconLinkButton href={`/exercises/${exercise.id}/edit`} icon={<Pencil />} aria-label="Edit exercise" />
                </div>
                <div className="flex-1">
                    <DeleteButton
                        entityName={exercise.name}
                        entityType="Exercise"
                        deleteAction={deleteAction}
                        onDelete={onDelete}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}