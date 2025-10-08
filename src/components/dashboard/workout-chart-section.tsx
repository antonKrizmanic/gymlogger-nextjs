'use client';

import { type ReactNode, useMemo, useState } from 'react';

import { IDashboard } from '@/src/models/domain/dashboard';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { BarChart3, Sparkles, TrendingUp } from 'lucide-react';

import {
  CHART_METRIC_OPTIONS,
  ChartMetric,
  ChartType,
  WorkoutChart,
} from './workout-chart';

interface WorkoutChartSectionProps {
  dashboard: IDashboard;
}

type RangeKey = '30d' | '90d' | '365d' | 'all';

const RANGE_OPTIONS: Array<{ id: RangeKey; label: string; description: string; days?: number }> = [
  { id: '30d', label: '30 days', description: 'Short-term focus', days: 30 },
  { id: '90d', label: '12 weeks', description: 'Quarterly momentum', days: 90 },
  { id: '365d', label: '1 year', description: 'Macro perspective', days: 365 },
  { id: 'all', label: 'All time', description: 'Entire history' },
];

const CHART_TYPE_OPTIONS: Array<{ id: ChartType; label: string; icon: ReactNode }> = [
  { id: 'line', label: 'Line', icon: <TrendingUp className="h-4 w-4" aria-hidden="true" /> },
  { id: 'bar', label: 'Bar', icon: <BarChart3 className="h-4 w-4" aria-hidden="true" /> },
];

export function WorkoutChartSection({ dashboard }: WorkoutChartSectionProps) {
  const data = useMemo(() => dashboard.workoutsByDate ?? [], [dashboard.workoutsByDate]);
  const [metric, setMetric] = useState<ChartMetric>('weight');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [range, setRange] = useState<RangeKey>('90d');

  const filteredData = useMemo(() => filterByRange(data, range), [data, range]);
  const metricConfig = CHART_METRIC_OPTIONS.find(option => option.value === metric) ?? CHART_METRIC_OPTIONS[0];

  if (!data.length) {
    return <EmptyChartState />;
  }

  return (
    <Card className="border-0 shadow-card-rest">
      <CardHeader className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {metricConfig.icon}
            </span>
            <div className="space-y-2">
              <CardTitle className="type-heading-sm text-foreground">{metricConfig.label}</CardTitle>
              <CardDescription className="type-body-sm text-muted-foreground">
                {metricConfig.description}
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="rounded-full border-dashed px-3 py-1">
                  Showing {RANGE_OPTIONS.find(option => option.id === range)?.description?.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {RANGE_OPTIONS.map(option => (
              <Button
                key={option.id}
                size="sm"
                variant={range === option.id ? 'secondary' : 'ghost'}
                className="rounded-full px-4"
                type="button"
                onClick={() => setRange(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {CHART_METRIC_OPTIONS.map(option => (
              <Button
                key={option.value}
                size="sm"
                variant={metric === option.value ? 'default' : 'outline'}
                className="rounded-full px-4"
                type="button"
                onClick={() => setMetric(option.value)}
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {option.icon}
                </span>
                {option.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {CHART_TYPE_OPTIONS.map(option => (
              <Button
                key={option.id}
                size="sm"
                variant={chartType === option.id ? 'secondary' : 'outline'}
                className="rounded-full px-4"
                type="button"
                onClick={() => setChartType(option.id)}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <WorkoutChart data={filteredData} metric={metric} chartType={chartType} />
      </CardContent>
    </Card>
  );
}

function EmptyChartState() {
  return (
    <Card className="border border-dashed border-border/70 bg-card/60">
      <CardContent className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <Sparkles className="absolute inset-0 m-auto h-14 w-14 text-primary" aria-hidden="true" />
          <div className="absolute -bottom-4 left-1/2 h-12 w-24 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>
        <div className="space-y-2">
          <h3 className="type-heading-sm text-foreground">Analytics unlock after your first workout</h3>
          <p className="type-body-sm text-muted-foreground max-w-md">
            Log a session to generate charts with preset ranges, trend deltas, and visual comparisons that reflect your
            training progress over time.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          <span>Return here after logging workouts to see your personalised insights.</span>
        </div>
      </CardContent>
    </Card>
  );
}

function filterByRange(data: IDashboard['workoutsByDate'] = [], range: RangeKey) {
  if (range === 'all') {
    return [...(data ?? [])];
  }

  const option = RANGE_OPTIONS.find(item => item.id === range);
  if (!option?.days) {
    return [...(data ?? [])];
  }

  const today = startOfDay(new Date());
  const start = addDays(today, -(option.days - 1));

  return (data ?? []).filter(item => {
    const date = new Date(item.date);
    if (Number.isNaN(date.valueOf())) return false;
    return date >= start;
  });
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}
