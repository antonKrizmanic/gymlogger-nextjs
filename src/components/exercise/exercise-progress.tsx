'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
import { IExerciseWorkout } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Label } from '@/src/components/ui/label';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExerciseProgressProps {
	exerciseId: string;
}

type ChartDataPoint = {
	date: string;
	formattedDate: string;
	maxWeight?: number;
	totalWeight?: number;
	totalReps?: number;
	maxReps?: number;
	totalSets?: number;
}

type MetricType = 'maxWeight' | 'totalWeight' | 'maxReps' | 'totalReps' | 'totalSets';

export function ExerciseProgress({ exerciseId }: ExerciseProgressProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [exerciseWorkouts, setExerciseWorkouts] = useState<IExerciseWorkout[]>([]);
	const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
	const [metric, setMetric] = useState<MetricType>('maxWeight');
	const [exerciseType, setExerciseType] = useState<ExerciseLogType>(ExerciseLogType.WeightAndReps);

	// Fetch all exercise workouts for the chart
	useEffect(() => {
		const fetchAllExerciseWorkouts = async () => {
			setIsLoading(true);
			try {
				const service = new ExerciseApiWorkoutService();
				// We need to fetch all records to show proper progress
				// Using a large page size to get as many records as possible
				const response = await service.getPaginatedExerciseWorkouts(exerciseId, 0, 100);
				
				setExerciseWorkouts(response.items);
				
				if (response.items.length > 0) {
					setExerciseType(response.items[0].exerciseLogType);
				}
			} catch (error) {
				console.error('Error fetching exercise workout data for charts:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllExerciseWorkouts();
	}, [exerciseId]);

	// Process the data for charts
	useEffect(() => {
		if (!exerciseWorkouts.length) return;

		// Sort workouts by date (oldest first)
		const sortedWorkouts = [...exerciseWorkouts].sort((a, b) => {
			return new Date(a.workoutDate || 0).getTime() - new Date(b.workoutDate || 0).getTime();
		});

		// Create chart data points
		const data: ChartDataPoint[] = sortedWorkouts.map(workout => {
			const workoutDate = workout.workoutDate ? new Date(workout.workoutDate) : new Date();
			const formattedDate = format(workoutDate, 'MMM d, yyyy');
			const dateStr = format(workoutDate, 'yyyy-MM-dd');
			
			// Find max weight from sets
			let maxWeight = 0;
			let maxReps = 0;
			
			if (workout.sets && workout.sets.length > 0) {
				workout.sets.forEach(set => {
					if (set.weight && set.weight > maxWeight) {
						maxWeight = set.weight;
					}
					if (set.reps && set.reps > maxReps) {
						maxReps = set.reps;
					}
				});
			}
			
			return {
				date: dateStr,
				formattedDate,
				maxWeight,
				totalWeight: workout.totalWeight || 0,
				totalReps: workout.totalReps || 0,
				maxReps,
				totalSets: workout.totalSets || 0
			};
		});
		
		setChartData(data);
	}, [exerciseWorkouts]);

	const handleMetricChange = (value: string) => {
		setMetric(value as MetricType);
	};

	const getMetricLabel = (metricType: MetricType): string => {
		const labels = {
			maxWeight: 'Max Weight (kg)',
			totalWeight: 'Total Weight (kg)',
			maxReps: 'Max Reps',
			totalReps: 'Total Reps',
			totalSets: 'Total Sets'
		};
		
		return labels[metricType];
	};

	const getAvailableMetrics = () => {
		// For weight and reps type, show all metrics
		if (exerciseType === ExerciseLogType.WeightAndReps) {
			return [
				{ value: 'maxWeight', label: 'Max Weight' },
				{ value: 'totalWeight', label: 'Total Weight' },
				{ value: 'maxReps', label: 'Max Reps' },
				{ value: 'totalReps', label: 'Total Reps' },
				{ value: 'totalSets', label: 'Total Sets' }
			];
		} 
		// For reps only, don't show weight metrics
		else if (exerciseType === ExerciseLogType.RepsOnly) {
			return [
				{ value: 'maxReps', label: 'Max Reps' },
				{ value: 'totalReps', label: 'Total Reps' },
				{ value: 'totalSets', label: 'Total Sets' }
			];
		} 
		// For time only, just show sets for now
		else {
			return [
				{ value: 'totalSets', label: 'Total Sets' }
			];
		}
	};
	
	if (isLoading) {
		return (
			<Card className="w-full">
				<CardContent className="p-6">
					<div className="flex justify-center">
						<p>Loading exercise progress data...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (exerciseWorkouts.length === 0) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Progress</CardTitle>
					<CardDescription>No workout data found for this exercise.</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Progress</h2>
			
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Performance Over Time</CardTitle>
					<CardDescription>Track your progress for this exercise</CardDescription>
					<div className="mt-4">
						<Label htmlFor="metric-select">Metric</Label>
						<Select 
							value={metric} 
							onValueChange={handleMetricChange}
						>
							<SelectTrigger id="metric-select" className="w-full md:w-[240px]">
								<SelectValue placeholder="Select metric" />
							</SelectTrigger>
							<SelectContent>
								{getAvailableMetrics().map(option => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					<div className="h-[400px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={chartData}
								margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis 
									dataKey="formattedDate" 
									angle={-45}
									textAnchor="end"
									height={70}
									tick={{ fontSize: 12 }}
								/>
								<YAxis 
									label={{ 
										value: getMetricLabel(metric), 
										angle: -90, 
										position: 'insideLeft',
										style: { textAnchor: 'middle' }
									}} 
								/>
								<Tooltip 
									formatter={(value) => [`${value}`, getMetricLabel(metric)]}
									labelFormatter={(label) => `Date: ${label}`}
								/>
								<Legend verticalAlign="top" height={36} />
								<Line 
									type="monotone" 
									dataKey={metric} 
									name={getMetricLabel(metric)}
									stroke="#8884d8" 
									activeDot={{ r: 8 }}
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}