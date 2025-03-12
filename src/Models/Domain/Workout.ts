import { ExerciseLogType } from "@/src/Types/Enums";

export interface IWorkout {
    id: string;
    name?: string;
    description?: string;
    date: Date;
    muscleGroupId: string;
    muscleGroupName?: string;
    totalWeight?: number;
    totalReps?: number;
    totalSets?: number;
    exercises: IExerciseWorkout[];
}

export interface IWorkoutCreate {
    name?: string;
    description?: string;
    date?: Date;
    exercises?: IExerciseWorkoutCreate[];
}

export interface IWorkoutUpdate extends IWorkoutCreate {
    id: string;
}

export interface IExerciseSet {
    id: string;
    index: number;
    weight?: number;
    reps?: number;
    time?: number;
    note?: string;
}

export interface IExerciseSetCreate extends Omit<IExerciseSet, 'id'> {
    id?: string;
}

export interface IExerciseWorkout {
    exerciseId: string;
    exerciseName?: string;
    workoutId: string;
    exerciseLogType: ExerciseLogType;
    totalWeight?: number;
    totalReps?: number;
    totalSets?: number;
    note?: string;
    index: number;
    sets?: IExerciseSet[];
}

export interface IExerciseWorkoutCreate {
    exerciseId?: string;
    index: number;
    note?: string;
    sets?: IExerciseSetCreate[];
} 