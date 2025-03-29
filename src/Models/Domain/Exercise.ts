import { ExerciseLogType } from '../../types/enums';

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
        id: exercise.id,
        name: exercise.name,
        muscleGroupId: exercise.muscleGroupId,
        muscleGroupName: exercise.muscleGroup?.name,
        description: exercise.description,
        exerciseLogType: exercise.exerciseLogType,
        isPublic: exercise.belongsToUserId === null,
    };
}