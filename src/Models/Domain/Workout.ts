import { ExerciseLogType } from "@/src/Types/Enums";

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



export const mapWorkoutToIWorkout = (workout: any): IWorkout => {
    console.log(workout);
    return {
        id: workout.id,
        name: workout.name,
        description: workout.description,
        date: workout.date,
        muscleGroupId: workout.muscleGroupId,
        muscleGroupName: workout.muscleGroups?.name,
        totalWeight: workout.totalWeight,
        totalReps: workout.totalReps,
        totalSets: workout.totalSets,
        exercises: workout.exerciseWorkouts?.map((exercise: any) => ({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exercise?.name,
            workoutId: exercise.workoutId,
            exerciseLogType: exercise.exerciseLogType,
            totalWeight: exercise.totalWeight,
            totalReps: exercise.totalReps,
            totalSets: exercise.totalSets,
            note: exercise.note,
            index: exercise.index,
            sets: exercise.exerciseSets.map((set: any) => ({
                id: set.id,
                index: set.index,
                weight: set.weight,
                reps: set.reps,
                time: set.time,
                note: set.note
            }))
        }))
    };
}