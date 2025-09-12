'use client';

import { IDashboard } from '@/src/models/domain/dashboard';
import { Card } from '../ui/card';
import { WorkoutChart } from './workout-chart';

interface WorkoutChartSectionProps {
  dashboard: IDashboard;
}

export function WorkoutChartSection({ dashboard }: WorkoutChartSectionProps) {
  if (!dashboard.workoutsByDate || dashboard.workoutsByDate.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-primary-900 dark:text-primary-100">Workout History</h3>
          <p className="text-primary-700 dark:text-primary-300 mt-2">
            No workout data available yet. Complete some workouts to see your progress!
          </p>
        </div>
      </Card>
    );
  }

  return <WorkoutChart data={dashboard.workoutsByDate} />;
} 