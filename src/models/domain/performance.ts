import type { ExerciseLogType } from '@/src/types/enums';
import type { IExerciseSetCreate } from './workout';

export type PersonalRecordKind =
    | 'maxWeight'
    | 'maxReps'
    | 'estimatedOneRepMax'
    | 'maxTime';

export interface IPersonalRecord {
    exerciseId: string;
    exerciseName: string;
    kind: PersonalRecordKind;
    value: number;
    unit: 'kg' | 'reps' | 'seconds';
    previousValue?: number;
    workoutId: string;
    date: Date;
}

export interface IPerformanceSession {
    exerciseId: string;
    exerciseName: string;
    exerciseLogType: ExerciseLogType;
    workoutId: string;
    date: Date;
    userWeight?: number;
    sets: IExerciseSetCreate[];
}

export interface IExerciseAnalytics {
    latest: Partial<Record<PersonalRecordKind, number>>;
    records: IPersonalRecord[];
}
