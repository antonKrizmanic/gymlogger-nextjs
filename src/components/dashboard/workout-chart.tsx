'use client';

import { IDashboardDateItem } from '@/src/models/domain/dashboard';

import { BarChart3, Dumbbell, Target, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface WorkoutChartProps {
  data: IDashboardDateItem[];
}

type ChartMetric = 'weight' | 'series' | 'reps';
type ChartType = 'line' | 'bar';

interface ChartDataItem {
  date: string;
  workouts: number;
  weight: number;
  series: number;
  reps: number;
  [key: string]: string | number; // Allow for dynamic access with string keys
}

// Helper function to safely convert value to number
const safeNumberConversion = (value: any): number => {
  if (value === null || value === undefined) return 0;
  // Handle BigInt values
  if (typeof value === 'bigint') return Number(value);
  // Handle other numeric values
  return Number(value);
};

export function WorkoutChart({ data }: WorkoutChartProps) {
  const [metric, setMetric] = useState<ChartMetric>('weight');
  const [chartType, setChartType] = useState<ChartType>('line');
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // Process data to count workouts per day
  const processedData = data.reduce((acc: ChartDataItem[], curr) => {
    // Find if we already have this date in our accumulator
    const existingDateIndex = acc.findIndex(item => item.date === curr.date);

    if (existingDateIndex >= 0) {
      // If date exists, increment workout count
      acc[existingDateIndex].workouts = (acc[existingDateIndex].workouts || 0) + 1;

      // Add other metrics if they exist, ensuring proper number conversion
      if (curr.weight !== undefined) {
        acc[existingDateIndex].weight = (acc[existingDateIndex].weight || 0) + safeNumberConversion(curr.weight);
      }
      if (curr.series !== undefined) {
        acc[existingDateIndex].series = (acc[existingDateIndex].series || 0) + safeNumberConversion(curr.series);
      }
      if (curr.reps !== undefined) {
        acc[existingDateIndex].reps = (acc[existingDateIndex].reps || 0) + safeNumberConversion(curr.reps);
      }
    } else {
      // If date doesn't exist, add a new entry
      acc.push({
        date: curr.date,
        workouts: 1,
        weight: safeNumberConversion(curr.weight) || 0,
        series: safeNumberConversion(curr.series) || 0,
        reps: safeNumberConversion(curr.reps) || 0
      });
    }

    return acc;
  }, []);

  // Sort by date
  processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format dates for display
  const formattedData = processedData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  // Get colors based on metric and theme - using primary teal color for all
  const getChartColors = () => {
    return isDarkMode ? '#2dd4bf' : '#14b8a6';  // Primary teal for all metrics
  };

  // Get secondary colors for gradients - using teal variations
  const getSecondaryColor = () => {
    return isDarkMode ? '#5eead4' : '#2dd4bf';  // Teal variations for all
  };

  // Get label and icon based on metric
  const getMetricInfo = () => {
    switch (metric) {
      case 'weight':
        return {
          label: 'Total Weight (kg)',
          icon: <Dumbbell className="h-4 w-4" />,
          description: 'Total weight lifted across all exercises'
        };
      case 'series':
        return {
          label: 'Training Sets',
          icon: <Target className="h-4 w-4" />,
          description: 'Number of sets completed'
        };
      case 'reps':
        return {
          label: 'Total Repetitions',
          icon: <TrendingUp className="h-4 w-4" />,
          description: 'Total reps performed across all exercises'
        };
      default:
        return {
          label: 'Total Weight (kg)',
          icon: <Dumbbell className="h-4 w-4" />,
          description: 'Total weight lifted across all exercises'
        };
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const metricInfo = getMetricInfo();
      return (
        <div className="bg-card border border-border shadow-xl rounded-lg p-4">
          <p className="font-semibold text-muted-foreground mb-2">{label}</p>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].color }}
            />
            <span className="text-sm text-muted-foreground">
              {metricInfo.label}:
            </span>
            <span className="text-sm font-bold text-muted-foreground">
              {payload[0].value}
              {metric === 'weight' ? ' kg' : ''}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const metricInfo = getMetricInfo();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {metricInfo.icon}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {metricInfo.label}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {metricInfo.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <div className="space-y-1 flex-1 sm:flex-none">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Metric
              </label>
              <Select value={metric} onValueChange={(value) => setMetric(value as ChartMetric)}>
                <SelectTrigger className="w-full sm:w-[140px] h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">
                    <div className="flex items-center space-x-2">
                      <Dumbbell className="h-4 w-4" />
                      <span>Weight</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="series">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Sets</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="reps">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Reps</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex-1 sm:flex-none">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Chart Type
              </label>
              <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
                <SelectTrigger className="w-full sm:w-[120px] h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Line</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bar">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Bar</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>

        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={formattedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getChartColors()} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={getChartColors()} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <XAxis
                  dataKey="date"
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
            ) : (
              <BarChart
                data={formattedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id={`barGradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getChartColors()} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={getSecondaryColor()} stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                <XAxis
                  dataKey="date"
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
                <Bar
                  dataKey={metric}
                  fill={`url(#barGradient-${metric})`}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}