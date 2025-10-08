'use client';

import { ReactNode, useMemo } from 'react';

import { IDashboardDateItem } from '@/src/models/domain/dashboard';

import { Dumbbell, Target, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export type ChartMetric = 'weight' | 'series' | 'reps';
export type ChartType = 'line' | 'bar';

export interface ChartMetricOption {
  value: ChartMetric;
  label: string;
  description: string;
  icon: ReactNode;
  suffix?: string;
}

export const CHART_METRIC_OPTIONS: ChartMetricOption[] = [
  {
    value: 'weight',
    label: 'Total weight (kg)',
    description: 'Total weight lifted across all exercises',
    icon: <Dumbbell className="h-4 w-4" aria-hidden="true" />,
    suffix: 'kg',
  },
  {
    value: 'series',
    label: 'Training sets',
    description: 'Number of sets completed',
    icon: <Target className="h-4 w-4" aria-hidden="true" />,
  },
  {
    value: 'reps',
    label: 'Total repetitions',
    description: 'Repetitions recorded across all sets',
    icon: <TrendingUp className="h-4 w-4" aria-hidden="true" />,
  },
];

interface WorkoutChartProps {
  data: IDashboardDateItem[];
  metric: ChartMetric;
  chartType: ChartType;
}

interface ChartDataItem {
  date: string;
  workouts: number;
  weight: number;
  series: number;
  reps: number;
  [key: string]: string | number;
}

export function WorkoutChart({ data, metric, chartType }: WorkoutChartProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const processedData = useMemo(() => buildChartData(data), [data]);
  const formattedData = useMemo(
    () =>
      processedData.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      })),
    [processedData],
  );

  const metricConfig = CHART_METRIC_OPTIONS.find(option => option.value === metric) ?? CHART_METRIC_OPTIONS[0];

  const gradientId = `gradient-${metric}`;
  const barGradientId = `bar-gradient-${metric}`;

  const tooltipRenderer = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-lg border border-border/60 bg-card px-3 py-2 shadow-card-rest">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
          <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].color }} />
          <span>{metricConfig.label}:</span>
          <span className="font-semibold text-foreground">
            {payload[0].value}
            {metricConfig.suffix ? ` ${metricConfig.suffix}` : ''}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[22rem]">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getPrimaryColor(isDarkMode)} stopOpacity={0.35} />
                <stop offset="95%" stopColor={getPrimaryColor(isDarkMode)} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="date" stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={12} fontWeight={500} />
            <YAxis stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={12} fontWeight={500} />
            <Tooltip content={tooltipRenderer} />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={getPrimaryColor(isDarkMode)}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              activeDot={{
                r: 6,
                fill: getPrimaryColor(isDarkMode),
                stroke: isDarkMode ? '#0f172a' : '#ffffff',
                strokeWidth: 2,
              }}
              dot={{
                r: 4,
                fill: getPrimaryColor(isDarkMode),
                stroke: isDarkMode ? '#0f172a' : '#ffffff',
                strokeWidth: 1,
              }}
            />
          </AreaChart>
        ) : (
          <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getPrimaryColor(isDarkMode)} stopOpacity={0.9} />
                <stop offset="95%" stopColor={getSecondaryColor(isDarkMode)} stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="date" stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={12} fontWeight={500} />
            <YAxis stroke={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={12} fontWeight={500} />
            <Tooltip content={tooltipRenderer} />
            <Bar dataKey={metric} fill={`url(#${barGradientId})`} radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function buildChartData(data: IDashboardDateItem[]): ChartDataItem[] {
  const result: ChartDataItem[] = [];

  for (const entry of data ?? []) {
    if (!entry?.date) continue;
    const existingIndex = result.findIndex(item => item.date === entry.date);

    const weight = safeNumber(entry.weight);
    const series = safeNumber(entry.series);
    const reps = safeNumber(entry.reps);

    if (existingIndex >= 0) {
      result[existingIndex].workouts = (result[existingIndex].workouts || 0) + 1;
      result[existingIndex].weight = (result[existingIndex].weight || 0) + weight;
      result[existingIndex].series = (result[existingIndex].series || 0) + series;
      result[existingIndex].reps = (result[existingIndex].reps || 0) + reps;
    } else {
      result.push({
        date: entry.date,
        workouts: 1,
        weight,
        series,
        reps,
      });
    }
  }

  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getPrimaryColor(isDark: boolean) {
  return isDark ? '#2dd4bf' : '#14b8a6';
}

function getSecondaryColor(isDark: boolean) {
  return isDark ? '#5eead4' : '#2dd4bf';
}

function safeNumber(value: unknown) {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'bigint') return Number(value);
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
