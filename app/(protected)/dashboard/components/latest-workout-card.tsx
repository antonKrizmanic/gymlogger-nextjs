import { IconLinkButton } from "@/src/components/common/icon-link-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { formatDate, formatNumber } from "@/src/lib/utils";
import { IDashboard } from "@/src/models/domain/dashboard";
import { Clock, Dumbbell, Eye, Pencil, Trophy } from "lucide-react";

interface LatestWorkoutCardProps {
    workout: NonNullable<IDashboard["lastWorkout"]>;
}

export function LatestWorkoutCard({ workout }: LatestWorkoutCardProps) {
    return (
        <div className="mb-8">
            <h2 className="type-heading-lg text-foreground mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Latest Achievement
            </h2>
            <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="type-heading-sm text-foreground">
                                {workout.name}
                            </CardTitle>
                            <CardDescription className="type-body-sm text-muted-foreground flex items-center mt-2 gap-1">
                                <Clock className="h-4 w-4" />
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
            <p className="type-heading-md text-primary">{formatNumber(value)}</p>
            <p className="type-body-sm text-muted-foreground">{label}</p>
        </div>
    );
}
