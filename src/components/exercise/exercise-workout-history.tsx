'use client';

import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
import { Pagination } from '@/src/components/common/pagination';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { IExerciseWorkout } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import { format } from 'date-fns';
import { ArrowRightIcon, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ExerciseWorkoutHistoryProps {
	exerciseId: string;
}

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
			<Card className="w-full">
				<CardContent className="p-6">
					<div className="flex justify-center">
						<p>Loading exercise workout history...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (exerciseWorkouts.length === 0) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Workout History</CardTitle>
					<CardDescription>No workout history found for this exercise.</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Workout History</h2>

			{exerciseWorkouts.map((workout) => (
				<Card key={workout.workoutId} className="w-full mb-4">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl">{workout.workoutName || 'Untitled Workout'}</CardTitle>
								<CardDescription className="flex items-center mt-1">
									<CalendarIcon className="h-4 w-4 mr-1" />
									{workout.workoutDate && format(new Date(workout.workoutDate), 'PPP')}
								</CardDescription>
							</div>
							<Button asChild variant="outline" className="ml-auto">
								<Link href={`/workouts/${workout.workoutId}`}>
									View Workout <ArrowRightIcon className="h-4 w-4 ml-2" />
								</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{workout.note && (
							<p className="text-sm text-muted-foreground mb-4">{workout.note}</p>
						)}

						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[60px] text-gray-500 dark:text-white">Set</TableHead>

									{workout.exerciseLogType === ExerciseLogType.WeightAndReps && (
										<>
											<TableHead className="text-gray-500 dark:text-white">Reps</TableHead>
											<TableHead className="text-gray-500 dark:text-white">Weight</TableHead>
										</>
									)}

									{workout.exerciseLogType === ExerciseLogType.RepsOnly && (
										<TableHead className="text-gray-500 dark:text-white">Reps</TableHead>
									)}

									{workout.exerciseLogType === ExerciseLogType.TimeOnly && (
										<TableHead className="text-gray-500 dark:text-white">Time</TableHead>
									)}

									<TableHead className="text-gray-500 dark:text-white">Notes</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{workout.sets?.map((set) => (
									<TableRow key={set.id}>
										<TableCell className="font-medium">{set.index + 1}</TableCell>

										{workout.exerciseLogType === ExerciseLogType.WeightAndReps && (
											<>
												<TableCell>{set.reps}</TableCell>
												<TableCell>{set.weight} kg</TableCell>
											</>
										)}

										{workout.exerciseLogType === ExerciseLogType.RepsOnly && (
											<TableCell>{set.reps}</TableCell>
										)}

										{workout.exerciseLogType === ExerciseLogType.TimeOnly && (
											<TableCell>{set.time}s</TableCell>
										)}

										<TableCell className="text-muted-foreground">{set.note || "-"}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className="mt-4">
							<p className="text-sm text-muted-foreground">
								{workout.totalSets} sets • {workout.totalReps} reps • {workout.totalWeight} kg total
							</p>
						</div>
					</CardContent>
				</Card>
			))}

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
				pageSize={pageSize}
				onPageSizeChange={handlePageSizeChange}
			/>
		</div>
	);
}