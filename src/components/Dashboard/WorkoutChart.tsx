'use client';

import { IDashboardDateItem } from '@/src/Models/Domain/Dashboard';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '../ui/card';

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

      // Add other metrics if they exist
      if (curr.weight) acc[existingDateIndex].weight = (acc[existingDateIndex].weight || 0) + curr.weight;
      if (curr.series) acc[existingDateIndex].series = (acc[existingDateIndex].series || 0) + curr.series;
      if (curr.reps) acc[existingDateIndex].reps = (acc[existingDateIndex].reps || 0) + curr.reps;
    } else {
      // If date doesn't exist, add a new entry
      acc.push({
        date: curr.date,
        workouts: 1,
        weight: curr.weight || 0,
        series: curr.series || 0,
        reps: curr.reps || 0
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

  const getColor = () => {
    return isDarkMode ? '#4d7a7a' : '#68a2a2';
  };

  // Get label based on metric
  const getLabel = () => {
    switch (metric) {
      case 'weight': return 'Weight (kg)';
      case 'series': return 'Series';
      case 'reps': return 'Repetitions';
      default: return 'Weight (kg)';
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium" style={{ color: payload[0].color }}>
              {payload[0].name}:
            </span>{' '}
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-600 dark:text-white">Workout Progress</h3>
            <div className="flex space-x-2">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as ChartMetric)}
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white"
              >
                <option value="weight">Weight</option>
                <option value="series">Series</option>
                <option value="reps">Reps</option>
              </select>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white"
              >
                <option value="line">Line</option>
                <option value="bar">Bar</option>
              </select>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={metric}
                    stroke={getColor()}
                    activeDot={{ r: 8 }}
                    name={getLabel()}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey={metric}
                    fill={getColor()}
                    name={getLabel()}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 