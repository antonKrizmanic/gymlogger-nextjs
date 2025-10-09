'use client';

import { useEffect, useMemo, useState } from 'react';

import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { IExerciseWorkout } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import { format } from 'date-fns';
import { BarChart3, Repeat, Sparkles, TrendingUp, Weight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipContentProps, XAxis, YAxis } from 'recharts';
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
};

type MetricType = 'maxWeight' | 'totalWeight' | 'maxReps' | 'totalReps' | 'totalSets';

export function ExerciseProgress({ exerciseId }: ExerciseProgressProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [exerciseWorkouts, setExerciseWorkouts] = useState<IExerciseWorkout[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [metric, setMetric] = useState<MetricType>('maxWeight');
  const [exerciseType, setExerciseType] = useState<ExerciseLogType>(ExerciseLogType.WeightAndReps);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  useEffect(() => {
    const fetchAllExerciseWorkouts = async () => {
      setIsLoading(true);
      try {
        const service = new ExerciseApiWorkoutService();
        const response = await service.getPaginatedExerciseWorkouts(exerciseId, 0, 200);

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

  useEffect(() => {
    if (!exerciseWorkouts.length) {
      setChartData([]);
      return;
    }

    const sortedWorkouts = [...exerciseWorkouts].sort((a, b) => {
      return new Date(a.workoutDate || 0).getTime() - new Date(b.workoutDate || 0).getTime();
    });

    const data: ChartDataPoint[] = sortedWorkouts.map(workout => {
      const workoutDate = workout.workoutDate ? new Date(workout.workoutDate) : new Date();
      const formattedDate = format(workoutDate, 'MMM d, yyyy');
      const dateStr = format(workoutDate, 'yyyy-MM-dd');

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
        totalSets: workout.totalSets || 0,
      };
    });

    setChartData(data);
  }, [exerciseWorkouts]);

  const availableMetrics = useMemo(() => getAvailableMetrics(exerciseType), [exerciseType]);

  useEffect(() => {
    if (!availableMetrics.some(item => item.value === metric)) {
      setMetric(availableMetrics[0]?.value ?? 'totalSets');
    }
  }, [availableMetrics, metric]);

  const currentMetricInfo = getMetricInfo(metric);
  const CurrentMetricIcon = currentMetricInfo.icon;

  const latestValue = chartData.at(-1)?.[metric] ?? 0;
  const previousValue = chartData.at(-2)?.[metric] ?? 0;
  const delta = latestValue - previousValue;

  const chartColor = 'var(--chart-1)';
  const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.2)';
  const axisColor = isDarkMode ? '#cbd5f5' : '#475569';

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-card/80 shadow-none">
        <CardContent className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6 animate-spin" aria-hidden="true" />
          </div>
          <p className="type-body-sm">Preparing progress charts…</p>
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="border border-dashed border-border/70 bg-card/60 shadow-none">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <TrendingUp className="h-12 w-12 text-primary" aria-hidden="true" />
          <div className="space-y-2">
            <h3 className="type-heading-sm text-foreground">No progress data yet</h3>
            <p className="mx-auto max-w-md type-body-sm text-muted-foreground">
              Complete a workout with this exercise to unlock visual trends for weight, reps, and volume.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-2xl border border-border/70 bg-card/95 p-4 shadow-card-rest">
          <p className="type-body-sm font-semibold text-foreground">{label}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{currentMetricInfo.label}:</span>
            <span className="font-semibold text-foreground">{formatMetricValue(payload[0].value as number, metric)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const latestDisplay = formatMetricValue(latestValue, metric);
  const deltaDisplay = formatDelta(delta, metric);
  const sessionsDisplay = `${chartData.length} session${chartData.length === 1 ? '' : 's'}`;

  return (
    <Card className="border border-border/60 bg-card/95 shadow-card-rest">
      <CardHeader className="space-y-6 border-b border-border/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CurrentMetricIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="space-y-2">
              <CardTitle className="type-heading-sm text-foreground">{currentMetricInfo.label}</CardTitle>
              <CardDescription className="type-body-sm text-muted-foreground">
                {currentMetricInfo.description}
              </CardDescription>
              <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                {sessionsDisplay} tracked
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="type-label text-muted-foreground uppercase tracking-wide">Metric</p>
            <Select value={metric} onValueChange={(value) => setMetric(value as MetricType)}>
              <SelectTrigger className="w-full min-w-[220px] rounded-full border-border/70 bg-background/80">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {availableMetrics.map(option => {
                  const OptionIcon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value} className="py-2">
                      <div className="flex items-center gap-2">
                        <OptionIcon className="h-4 w-4" aria-hidden="true" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-border/60 bg-background/70 px-5 py-4">
            <p className="type-label text-muted-foreground uppercase tracking-wide">Latest value</p>
            <p className="mt-2 type-heading-sm text-foreground">{latestDisplay}</p>
            <p className="mt-1 type-body-sm text-muted-foreground">From your most recent workout</p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background/70 px-5 py-4">
            <p className="type-label text-muted-foreground uppercase tracking-wide">Change vs. prior</p>
            <p className="mt-2 type-heading-sm text-foreground">{deltaDisplay}</p>
            <p className="mt-1 type-body-sm text-muted-foreground">Difference from the previous logged session</p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background/70 px-5 py-4">
            <p className="type-label text-muted-foreground uppercase tracking-wide">Total sessions</p>
            <p className="mt-2 type-heading-sm text-foreground">{chartData.length.toLocaleString()}</p>
            <p className="mt-1 type-body-sm text-muted-foreground">Sessions included in this trend line</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 24, right: 24, left: 16, bottom: 32 }}
            >
              <defs>
                <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} />
              <XAxis
                dataKey="formattedDate"
                angle={-35}
                textAnchor="end"
                height={60}
                stroke={axisColor}
                fontSize={12}
              />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip content={CustomTooltip} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }} />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={chartColor}
                strokeWidth={3}
                fill={`url(#gradient-${metric})`}
                activeDot={{
                  r: 6,
                  fill: chartColor,
                  stroke: isDarkMode ? '#0f172a' : '#ffffff',
                  strokeWidth: 2,
                }}
                dot={{
                  r: 4,
                  fill: chartColor,
                  stroke: isDarkMode ? '#0f172a' : '#ffffff',
                  strokeWidth: 1,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function getMetricInfo(metricType: MetricType) {
  const metricMap = {
    maxWeight: {
      label: 'Max weight (kg)',
      icon: Weight,
      description: 'Heaviest single set recorded for this movement.',
    },
    totalWeight: {
      label: 'Total weight (kg)',
      icon: Weight,
      description: 'Combined weight lifted per workout across all sets.',
    },
    maxReps: {
      label: 'Max reps',
      icon: Repeat,
      description: 'Highest repetitions achieved in a single set.',
    },
    totalReps: {
      label: 'Total reps',
      icon: Repeat,
      description: 'Sum of repetitions across every set in a workout.',
    },
    totalSets: {
      label: 'Total sets',
      icon: BarChart3,
      description: 'Number of sets completed per workout.',
    },
  } as const;

  return metricMap[metricType];
}

function getAvailableMetrics(exerciseType: ExerciseLogType) {
  if (exerciseType === ExerciseLogType.WeightAndReps) {
    return [
      { value: 'maxWeight', label: 'Max weight', icon: Weight },
      { value: 'totalWeight', label: 'Total weight', icon: Weight },
      { value: 'maxReps', label: 'Max reps', icon: Repeat },
      { value: 'totalReps', label: 'Total reps', icon: Repeat },
      { value: 'totalSets', label: 'Total sets', icon: BarChart3 },
    ];
  }

  if (
    exerciseType === ExerciseLogType.BodyWeight ||
    exerciseType === ExerciseLogType.BodyWeightWithAdditionalWeight ||
    exerciseType === ExerciseLogType.BodyWeightWithAssistance
  ) {
    return [
      { value: 'maxWeight', label: 'Max weight (bodyweight)', icon: Weight },
      { value: 'totalWeight', label: 'Total weight (bodyweight)', icon: Weight },
      { value: 'maxReps', label: 'Max reps', icon: Repeat },
      { value: 'totalReps', label: 'Total reps', icon: Repeat },
      { value: 'totalSets', label: 'Total sets', icon: BarChart3 },
    ];
  }

  if (exerciseType === ExerciseLogType.RepsOnly) {
    return [
      { value: 'maxReps', label: 'Max reps', icon: Repeat },
      { value: 'totalReps', label: 'Total reps', icon: Repeat },
      { value: 'totalSets', label: 'Total sets', icon: BarChart3 },
    ];
  }

  return [{ value: 'totalSets', label: 'Total sets', icon: BarChart3 }];
}

function formatMetricValue(value: number, metric: MetricType, withUnit = true) {
  const unit = getMetricUnit(metric);
  const numeric = Number.isFinite(value) ? value : 0;
  const absolute = Math.abs(numeric);
  const formattedMagnitude = Number.isInteger(absolute)
    ? absolute.toLocaleString()
    : absolute.toFixed(1);
  const signedMagnitude = numeric < 0 ? `−${formattedMagnitude}` : formattedMagnitude;

  if (!withUnit || !unit) {
    return signedMagnitude;
  }
  return `${signedMagnitude} ${unit}`;
}

function formatDelta(value: number, metric: MetricType) {
  if (Math.abs(value) < 0.05) {
    const unit = getMetricUnit(metric);
    return unit ? `0 ${unit}` : '0';
  }

  const sign = value > 0 ? '+' : '−';
  return `${sign}${formatMetricValue(Math.abs(value), metric, true)}`;
}

function getMetricUnit(metric: MetricType) {
  switch (metric) {
    case 'maxWeight':
    case 'totalWeight':
      return 'kg';
    case 'maxReps':
    case 'totalReps':
      return 'reps';
    case 'totalSets':
      return 'sets';
    default:
      return '';
  }
}
