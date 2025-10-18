import type { ExerciseLogType } from '@/src/types/enums';

export interface IWorkout extends IWorkoutSimple {
    exercises: IExerciseWorkout[];
}

export interface IWorkoutSimple {
    id: string;
    name?: string;
    description?: string;
    date: Date;
    muscleGroupId: string;
    muscleGroupName?: string;
    totalWeight?: number;
    totalReps?: number;
    totalSets?: number;
    userWeight?: number; // User's weight at workout time for historical accuracy
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
    exerciseDescription?: string | null;
    workoutId: string;
    workoutDate?: Date;
    workoutName?: string;
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

export const mapWorkoutToIWorkout = (workout: any): IWorkout => {
    return {
        id: workout.id,
        name: workout.name,
        description: workout.description,
        date: workout.date,
        muscleGroupId: workout.muscleGroupId,
        muscleGroupName: workout.muscleGroup?.name,
        totalWeight: Number(workout.totalWeight),
        totalReps: Number(workout.totalReps),
        totalSets: Number(workout.totalSets),
        userWeight: workout.userWeight ? Number(workout.userWeight) : undefined,
        exercises: workout.exerciseWorkouts?.map((exercise: any) => ({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exercise?.name,
            exerciseDescription: exercise.exercise?.description,
            workoutId: exercise.workoutId,
            exerciseLogType: exercise.exercise
                ?.exerciseLogType as unknown as ExerciseLogType,
            totalWeight: Number(exercise.totalWeight),
            totalReps: Number(exercise.totalReps),
            totalSets: Number(exercise.totalSets),
            note: exercise.note,
            index: exercise.index,
            sets: exercise.exerciseSets.map((set: any) => ({
                id: set.id,
                index: set.index,
                weight: Number(set.weight),
                reps: Number(set.reps),
                time: Number(set.time),
                note: set.note,
            })),
        })),
    };
};
