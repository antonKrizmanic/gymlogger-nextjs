import type { IWorkoutSimple } from './workout';

export interface IDashboardDateItem {
    date: string;
    weight?: number;
    series?: number;
    reps?: number;
}

export interface IMuscleGroupBalance {
    muscleGroupId: string;
    muscleGroupName: string;
    currentWeekSets: number;
    previousFourWeekAverage: number;
    changePercent?: number;
}

export interface IDashboard {
    lastWorkout?: IWorkoutSimple;
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
    muscleGroupBalance?: IMuscleGroupBalance[];
}
