'use client';

import { IDashboard } from '@/src/Models/Domain/Dashboard';
import { WorkoutChart } from './WorkoutChart';
import { Card } from '../Common/Card';

interface WorkoutChartSectionProps {
  dashboard: IDashboard;
}

export function WorkoutChartSection({ dashboard }: WorkoutChartSectionProps) {
  if (!dashboard.workoutsByDate || dashboard.workoutsByDate.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Workout History</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            No workout data available yet. Complete some workouts to see your progress!
          </p>
        </div>
      </Card>
    );
  }

  return <WorkoutChart data={dashboard.workoutsByDate} />;
} 