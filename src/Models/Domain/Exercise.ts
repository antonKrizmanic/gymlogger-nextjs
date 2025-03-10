import { ExerciseLogType } from '../../Types/Enums';

export interface IExercise {
    id: string;
    name: string;
    muscleGroupId: string;
    muscleGroupName?: string;
    description?: string;
    exerciseLogType: ExerciseLogType;
    isPublic: boolean;
}

export interface IExerciseCreate {
    name: string;
    muscleGroupId: string;
    description?: string;
    exerciseLogType: ExerciseLogType;
}

export interface IExerciseUpdate extends IExerciseCreate {
    id: string;
}

export function mapExerciseToIExercise(exercise: any): IExercise {
    return {
        id: exercise.Id,
        name: exercise.Name,
        muscleGroupId: exercise.MuscleGroupId,
        muscleGroupName: exercise.MuscleGroups?.Name,
        description: exercise.Description,
        exerciseLogType: exercise.ExerciseLogType,
        isPublic: exercise.BelongsToUserId === null,
    };
}