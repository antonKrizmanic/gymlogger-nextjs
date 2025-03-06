import { IWorkout } from './Workout';

export interface IDashboardDateItem {
    date: string;
    weight?: number;
    series?: number;
    reps?: number;
}

export interface IDashboard {
    lastWorkout?: IWorkout;
    favoriteMuscleGroupName?: string;
    workoutsCount: number;
    workoutsThisWeek: number;
    workoutsThisMonth: number;
    workoutsThisYear: number;
    seriesThisWeek?: number;
    seriesThisMonth?: number;
    seriesThisYear?: number;
    weightThisWeek?: number;
    weightThisMonth?: number;
    weightThisYear?: number;
    workoutsByDate?: IDashboardDateItem[];
} 