'use client';

import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { IExerciseWorkout } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import { format } from 'date-fns';
import { BarChart3, Repeat, TrendingUp, Weight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipContentProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

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
	const { resolvedTheme } = useTheme();
	const isDarkMode = resolvedTheme === 'dark';

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

	// Get colors based on theme - using primary color
	const getChartColors = () => {
		return isDarkMode ? '#14b8a6' : '#0d9488';  // Primary teal
	};


	const getMetricInfo = (metricType: MetricType) => {
		const metricMap = {
			maxWeight: {
				label: 'Max Weight (kg)',
				icon: Weight,
				description: 'Heaviest single set weight achieved'
			},
			totalWeight: {
				label: 'Total Weight (kg)',
				icon: Weight,
				description: 'Total weight lifted in the workout'
			},
			maxReps: {
				label: 'Max Reps',
				icon: Repeat,
				description: 'Highest repetitions in a single set'
			},
			totalReps: {
				label: 'Total Reps',
				icon: Repeat,
				description: 'Total repetitions across all sets'
			},
			totalSets: {
				label: 'Total Sets',
				icon: BarChart3,
				description: 'Number of sets completed'
			}
		};

		return metricMap[metricType];
	};

	const getAvailableMetrics = () => {
		// For weight and reps type, show all metrics
		if (exerciseType === ExerciseLogType.WeightAndReps) {
			return [
				{ value: 'maxWeight', label: 'Max Weight', icon: Weight },
				{ value: 'totalWeight', label: 'Total Weight', icon: Weight },
				{ value: 'maxReps', label: 'Max Reps', icon: Repeat },
				{ value: 'totalReps', label: 'Total Reps', icon: Repeat },
				{ value: 'totalSets', label: 'Total Sets', icon: BarChart3 }
			];
		}
		// For reps only, don't show weight metrics
		else if (exerciseType === ExerciseLogType.RepsOnly) {
			return [
				{ value: 'maxReps', label: 'Max Reps', icon: Repeat },
				{ value: 'totalReps', label: 'Total Reps', icon: Repeat },
				{ value: 'totalSets', label: 'Total Sets', icon: BarChart3 }
			];
		}
		// For time only, just show sets for now
		else {
			return [
				{ value: 'totalSets', label: 'Total Sets', icon: BarChart3 }
			];
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[300px]">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
					<p className="text-muted-foreground">Loading progress data...</p>
				</div>
			</div>
		);
	}

	if (exerciseWorkouts.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="flex flex-col items-center space-y-4">
					<div className="p-4 bg-muted/50 rounded-full">
						<TrendingUp className="h-8 w-8 text-muted-foreground" />
					</div>
					<div className="space-y-2">
						<h3 className="text-xl font-semibold text-foreground">No Progress Data</h3>
						<p className="text-muted-foreground max-w-md">
							Complete some workouts with this exercise to see your progress charts and analytics.
						</p>
					</div>
				</div>
			</div>
		);
	}

	const currentMetricInfo = getMetricInfo(metric);
	const CurrentMetricIcon = currentMetricInfo.icon;

	// Custom tooltip component
	const CustomTooltip = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-card border border-border shadow-xl rounded-lg p-4">
					<p className="font-semibold text-muted-foreground mb-2">{label}</p>
					<div className="flex items-center space-x-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: payload[0].color }}
						/>
						<span className="text-sm text-muted-foreground">
							{currentMetricInfo.label}:
						</span>
						<span className="text-sm font-bold text-muted-foreground">
							{payload[0].value}
							{metric.includes('Weight') ? ' kg' : ''}
						</span>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<Card className="border-0 shadow-lg">
			<CardHeader className="pb-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
					<div className="flex items-center space-x-3">
						<div className="p-2 bg-primary/10 rounded-lg">
							<CurrentMetricIcon className="h-4 w-4" />
						</div>
						<div>
							<CardTitle className="text-xl font-bold text-foreground">
								{currentMetricInfo.label}
							</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								{currentMetricInfo.description}
							</p>
						</div>
					</div>

					<div className="space-y-1 flex-1 sm:flex-none">
						<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							Metric
						</label>
						<Select value={metric} onValueChange={handleMetricChange}>
							<SelectTrigger className="w-full sm:w-[200px] h-10">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{getAvailableMetrics().map(option => {
									const OptionIcon = option.icon;
									return (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center space-x-2">
												<OptionIcon className="h-4 w-4" />
												<span>{option.label}</span>
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="h-80 mt-4">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
						>
							<defs>
								<linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor={getChartColors()} stopOpacity={0.3} />
									<stop offset="95%" stopColor={getChartColors()} stopOpacity={0.05} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
							<XAxis
								dataKey="formattedDate"
								angle={-45}
								textAnchor="end"
								height={70}
								stroke={isDarkMode ? '#94a3b8' : '#64748b'}
								fontSize={12}
								fontWeight={500}
							/>
							<YAxis
								stroke={isDarkMode ? '#94a3b8' : '#64748b'}
								fontSize={12}
								fontWeight={500}
							/>
							<Tooltip content={CustomTooltip} />
							<Line
								type="monotone"
								dataKey={metric}
								stroke={getChartColors()}
								strokeWidth={3}
								fill={`url(#gradient-${metric})`}
								activeDot={{
									r: 6,
									fill: getChartColors(),
									stroke: isDarkMode ? '#1a1f29' : '#ffffff',
									strokeWidth: 2
								}}
								dot={{
									r: 4,
									fill: getChartColors(),
									stroke: isDarkMode ? '#1a1f29' : '#ffffff',
									strokeWidth: 1
								}}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}