import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { IExerciseWorkout } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import { getLogTypeInfo } from '@/src/utils/get-log-type-info';
import { Activity, ArrowRightIcon, Target, Weight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExerciseSets } from './exercise-sets';

interface WorkoutExerciseListProps {
    exercises: IExerciseWorkout[];
    userWeight?: number;
}

export function WorkoutExerciseList({ exercises, userWeight }: WorkoutExerciseListProps) {
    if (!exercises || exercises.length === 0) {
        return (
            <Card className="border-0">
                <CardContent className="text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-muted/50 rounded-full">
                            <Activity className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="type-heading-sm text-foreground">No Exercises</h3>
                            <p className="type-body-md text-muted-foreground max-w-md">
                                This workout doesn&apos;t contain any exercises yet.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="type-heading-md text-foreground">
                    Exercises ({exercises.length})
                </h2>
            </div>

            {exercises.map((exercise) => {
                const logTypeInfo = getLogTypeInfo(exercise.exerciseLogType);
                const LogTypeIcon = logTypeInfo.icon;

                return (
                    <Card
                        key={exercise.exerciseId}
                        className="border-0 bg-gradient-to-br from-card to-card/80 hover:shadow-card-hover focus-visible:shadow-card-hover active:shadow-card-pressed transition-shadow"
                    >
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <CardTitle className="type-heading-sm text-foreground">
                                            {exercise.exerciseName || 'Untitled Exercise'}
                                        </CardTitle>
                                        <Badge variant={logTypeInfo.variant} className="type-body-sm flex items-center gap-1">
                                            <LogTypeIcon className="h-3 w-3" />
                                            {logTypeInfo.label}
                                        </Badge>
                                        {/* Show bodyweight badge for bodyweight exercises */}
                                        {userWeight && (exercise.exerciseLogType === ExerciseLogType.BodyWeight || exercise.exerciseLogType === ExerciseLogType.BodyWeightWithAdditionalWeight || exercise.exerciseLogType === ExerciseLogType.BodyWeightWithAssistance) && (
                                            <Badge variant="outline" className="type-body-sm flex items-center gap-1">
                                                <Weight className="h-3 w-3" />
                                                Bodyweight: {userWeight}kg
                                            </Badge>
                                        )}
                                    </div>
                                    {exercise.exerciseDescription && (
                                        <CardDescription className="type-body-sm text-muted-foreground">
                                            {exercise.exerciseDescription}
                                        </CardDescription>
                                    )}
                                </div>
                                <Button asChild variant="outline" size="sm" className="shrink-0">
                                    <Link href={`/exercises/${exercise.exerciseId}`}>
                                        View Exercise <ArrowRightIcon className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ExerciseSets exercise={exercise} />
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
} 