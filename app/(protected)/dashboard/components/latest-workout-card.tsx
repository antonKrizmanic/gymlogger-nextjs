import { Clock, Dumbbell, Eye, Pencil, Trophy } from 'lucide-react';
import { IconLinkButton } from '@/src/components/common/icon-link-button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { formatDate, formatNumber } from '@/src/lib/utils';
import type { IDashboard } from '@/src/models/domain/dashboard';

interface LatestWorkoutCardProps {
    workout: NonNullable<IDashboard['lastWorkout']>;
}

export function LatestWorkoutCard({ workout }: LatestWorkoutCardProps) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-primary" />
                Latest Achievement
            </h2>
            <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-foreground">
                                {workout.name}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground flex items-center mt-2">
                                <Clock className="mr-1 h-4 w-4" />
                                {formatDate(workout.date)}
                            </CardDescription>
                        </div>
                        <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                </CardHeader>

                <CardContent className="pb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <Metric label="Sets" value={workout.totalSets} />
                        <Metric label="Reps" value={workout.totalReps} />
                        <Metric label="kg Total" value={workout.totalWeight} />
                    </div>
                </CardContent>

                <CardFooter className="flex gap-3 pt-0">
                    <div className="flex-1">
                        <IconLinkButton
                            href={`/workouts/${workout.id}`}
                            icon={<Eye />}
                            aria-label="View workout details"
                        />
                    </div>
                    <div className="flex-1">
                        <IconLinkButton
                            href={`/workouts/${workout.id}/edit`}
                            icon={<Pencil />}
                            aria-label="Edit workout"
                        />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

interface MetricProps {
    label: string;
    value?: number | null;
}

function Metric({ label, value }: MetricProps) {
    return (
        <div className="bg-background/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary">
                {formatNumber(value)}
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}
