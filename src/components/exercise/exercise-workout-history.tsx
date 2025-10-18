'use client';

import { format } from 'date-fns';
import { Activity, ArrowRightIcon, CalendarIcon, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
import { Pagination } from '@/src/components/common/pagination';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { ExerciseSets } from '@/src/components/workout/exercise-sets';
import type { IExerciseWorkout } from '@/src/models/domain/workout';

interface ExerciseWorkoutHistoryProps {
    exerciseId: string;
}

export function ExerciseWorkoutHistory({
    exerciseId,
}: ExerciseWorkoutHistoryProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [exerciseWorkouts, setExerciseWorkouts] = useState<
        IExerciseWorkout[]
    >([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchExerciseWorkouts = async () => {
            setIsLoading(true);
            try {
                const service = new ExerciseApiWorkoutService();
                const response = await service.getPaginatedExerciseWorkouts(
                    exerciseId,
                    currentPage,
                    pageSize,
                );

                setExerciseWorkouts(response.items);
                setTotalPages(response.pagingData.totalPages);
            } catch (error) {
                console.error(
                    'Error fetching exercise workout history:',
                    error,
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchExerciseWorkouts();
    }, [exerciseId, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newSize: string) => {
        setPageSize(Number(newSize));
        setCurrentPage(0);
    };

    if (isLoading) {
        return (
            <Card className="border-2 shadow-lg">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Dumbbell className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <p className="text-muted-foreground">
                            Loading workout history...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (exerciseWorkouts.length === 0) {
        return (
            <Card className="border-2 shadow-lg">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-muted/50 rounded-full">
                            <Dumbbell className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">
                                No Workout History
                            </h3>
                            <p className="text-muted-foreground">
                                This exercise hasn&apos;t been performed in any
                                workouts yet.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Workout History</h2>
                    <p className="text-sm text-muted-foreground">
                        {exerciseWorkouts.length} workout
                        {exerciseWorkouts.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {exerciseWorkouts.map((workout) => {
                return (
                    <Card
                        key={workout.workoutId}
                        className="border-2 shadow-lg bg-gradient-to-br from-card to-card/80"
                    >
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <CardTitle className="text-xl font-bold">
                                            {workout.workoutName ||
                                                'Untitled Workout'}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="flex items-center space-x-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>
                                            {workout.workoutDate &&
                                                format(
                                                    new Date(
                                                        workout.workoutDate,
                                                    ),
                                                    'PPP',
                                                )}
                                        </span>
                                    </CardDescription>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link
                                        href={`/workouts/${workout.workoutId}`}
                                    >
                                        View workout{' '}
                                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {workout.note && (
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        {workout.note}
                                    </p>
                                </div>
                            )}

                            <ExerciseSets exercise={workout} />

                            {/* Summary Footer */}
                            {(workout.totalSets ||
                                workout.totalReps ||
                                (workout.totalWeight &&
                                    workout.totalWeight > 0)) && (
                                <div className="flex items-center justify-center space-x-6 pt-4 border-t border-muted">
                                    {workout.totalSets && (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <span className="text-sm font-medium">
                                                {workout.totalSets} sets
                                            </span>
                                        </div>
                                    )}
                                    {workout.totalReps && (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <span className="text-sm font-medium">
                                                {workout.totalReps} reps
                                            </span>
                                        </div>
                                    )}
                                    {workout.totalWeight &&
                                        workout.totalWeight > 0 && (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                <span className="text-sm font-medium">
                                                    {workout.totalWeight} kg
                                                    total
                                                </span>
                                            </div>
                                        )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    );
}
