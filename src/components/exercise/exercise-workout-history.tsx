'use client';

import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
import { Pagination } from '@/src/components/common/pagination';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { IExerciseWorkout } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import { format } from 'date-fns';
import { Activity, ArrowRightIcon, CalendarIcon, Clock, Dumbbell, Repeat, Weight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ExerciseWorkoutHistoryProps {
	exerciseId: string;
}

// Helper function to get log type information
const getLogTypeInfo = (logType: ExerciseLogType) => {
	switch (logType) {
		case ExerciseLogType.WeightAndReps:
			return {
				label: 'Weight & Reps',
				icon: <Weight className="h-3 w-3" />,
				variant: 'default' as const
			};
		case ExerciseLogType.RepsOnly:
			return {
				label: 'Reps Only',
				icon: <Repeat className="h-3 w-3" />,
				variant: 'secondary' as const
			};
		case ExerciseLogType.TimeOnly:
			return {
				label: 'Time Only',
				icon: <Clock className="h-3 w-3" />,
				variant: 'outline' as const
			};
		default:
			return {
				label: 'Unknown',
				icon: <Activity className="h-3 w-3" />,
				variant: 'secondary' as const
			};
	}
};

export function ExerciseWorkoutHistory({ exerciseId }: ExerciseWorkoutHistoryProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [exerciseWorkouts, setExerciseWorkouts] = useState<IExerciseWorkout[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(12);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		const fetchExerciseWorkouts = async () => {
			setIsLoading(true);
			try {
				const service = new ExerciseApiWorkoutService();
				const response = await service.getPaginatedExerciseWorkouts(exerciseId, currentPage, pageSize);

				setExerciseWorkouts(response.items);
				setTotalPages(response.pagingData.totalPages);
			} catch (error) {
				console.error('Error fetching exercise workout history:', error);
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
						<p className="text-muted-foreground">Loading workout history...</p>
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
							<h3 className="text-lg font-semibold">No Workout History</h3>
							<p className="text-muted-foreground">
								This exercise hasn&apos;t been performed in any workouts yet.
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
						{exerciseWorkouts.length} workout{exerciseWorkouts.length !== 1 ? 's' : ''} found
					</p>
				</div>
			</div>

			{exerciseWorkouts.map((workout) => {
				const workoutLogTypeInfo = getLogTypeInfo(workout.exerciseLogType);

				return (
					<Card key={workout.workoutId} className="border-2 shadow-lg bg-gradient-to-br from-card to-card/80">
						<CardHeader className="pb-4">
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
								<div className="space-y-2">
									<div className="flex items-center space-x-3">
										<CardTitle className="text-xl font-bold">
											{workout.workoutName || 'Untitled Workout'}
										</CardTitle>
										<Badge
											variant={workoutLogTypeInfo.variant}
											className="flex items-center space-x-1"
										>
											{workoutLogTypeInfo.icon}
											<span className="text-xs">{workoutLogTypeInfo.label}</span>
										</Badge>
									</div>
									<CardDescription className="flex items-center space-x-2">
										<CalendarIcon className="h-4 w-4" />
										<span>
											{workout.workoutDate && format(new Date(workout.workoutDate), 'PPP')}
										</span>
									</CardDescription>
								</div>
								<Button asChild variant="outline" size="sm">
									<Link href={`/workouts/${workout.workoutId}`}>
										View Details <ArrowRightIcon className="h-4 w-4 ml-2" />
									</Link>
								</Button>
							</div>
						</CardHeader>

						<CardContent className="space-y-4">
							{workout.note && (
								<div className="p-3 bg-muted/50 rounded-lg">
									<p className="text-sm text-muted-foreground">{workout.note}</p>
								</div>
							)}

							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="border-muted hover:bg-transparent">
											<TableHead className="w-[60px] text-muted-foreground font-semibold">Set</TableHead>

											{workout.exerciseLogType === ExerciseLogType.WeightAndReps && (
												<>
													<TableHead className="text-muted-foreground font-semibold">Reps</TableHead>
													<TableHead className="text-muted-foreground font-semibold">Weight</TableHead>
												</>
											)}

											{workout.exerciseLogType === ExerciseLogType.RepsOnly && (
												<TableHead className="text-muted-foreground font-semibold">Reps</TableHead>
											)}

											{workout.exerciseLogType === ExerciseLogType.TimeOnly && (
												<TableHead className="text-muted-foreground font-semibold">Time</TableHead>
											)}

											<TableHead className="text-muted-foreground font-semibold">Notes</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{workout.sets?.map((set) => (
											<TableRow key={set.id} className="border-muted hover:bg-muted/30">
												<TableCell className="font-bold text-primary">{set.index + 1}</TableCell>

												{workout.exerciseLogType === ExerciseLogType.WeightAndReps && (
													<>
														<TableCell className="font-medium">{set.reps}</TableCell>
														<TableCell className="font-medium">{set.weight} kg</TableCell>
													</>
												)}

												{workout.exerciseLogType === ExerciseLogType.RepsOnly && (
													<TableCell className="font-medium">{set.reps}</TableCell>
												)}

												{workout.exerciseLogType === ExerciseLogType.TimeOnly && (
													<TableCell className="font-medium">{set.time}s</TableCell>
												)}

												<TableCell className="text-muted-foreground text-sm">{set.note || "-"}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							{/* Summary Footer */}
							{(workout.totalSets || workout.totalReps || (workout.totalWeight && workout.totalWeight > 0)) && (
								<div className="flex items-center justify-center space-x-6 pt-4 border-t border-muted">
									{workout.totalSets && (
										<div className="flex items-center space-x-2">
											<div className="w-2 h-2 bg-primary rounded-full"></div>
											<span className="text-sm font-medium">{workout.totalSets} sets</span>
										</div>
									)}
									{workout.totalReps && (
										<div className="flex items-center space-x-2">
											<div className="w-2 h-2 bg-primary rounded-full"></div>
											<span className="text-sm font-medium">{workout.totalReps} reps</span>
										</div>
									)}
									{workout.totalWeight && workout.totalWeight > 0 && (
										<div className="flex items-center space-x-2">
											<div className="w-2 h-2 bg-primary rounded-full"></div>
											<span className="text-sm font-medium">{workout.totalWeight} kg total</span>
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