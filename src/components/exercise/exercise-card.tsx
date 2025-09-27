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
        <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-card/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-foreground mb-2">
                            {exercise.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                            {exercise.muscleGroupName && (
                                <Badge variant="secondary" className="text-xs">
                                    {exercise.muscleGroupName}
                                </Badge>
                            )}
                            <Badge variant={logTypeInfo.variant} className="text-xs flex items-center gap-1">
                                <LogTypeIcon className="h-3 w-3" />
                                {logTypeInfo.label}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {exercise.description && (
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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