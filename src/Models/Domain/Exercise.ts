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