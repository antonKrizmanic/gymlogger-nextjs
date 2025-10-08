'use client';

import { IDashboard } from '@/src/models/domain/dashboard';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { WorkoutChart } from './workout-chart';

interface WorkoutChartSectionProps {
  dashboard: IDashboard;
}

export function WorkoutChartSection({ dashboard }: WorkoutChartSectionProps) {
  if (!dashboard.workoutsByDate || dashboard.workoutsByDate.length === 0) {
    return (
      <Card className="border-0">
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="type-heading-sm text-foreground">No Data Yet</h3>
              <p className="type-body-md text-muted-foreground max-w-md">
                Start tracking your workouts to see detailed analytics and progress charts.
                Your fitness journey visualization will appear here!
              </p>
            </div>
            <div className="flex items-center type-body-sm text-muted-foreground mt-4">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Charts will show your progress over time</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <WorkoutChart data={dashboard.workoutsByDate} />;
} 