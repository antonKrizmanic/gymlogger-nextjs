import { describe, expect, it } from 'vitest';
import type { IPerformanceSession } from '@/src/models/domain/performance';
import { ExerciseLogType } from '@/src/types/enums';
import {
    calculateSessionMetrics,
    calculateWorkoutPersonalRecords,
} from './performance';

const session = (
    overrides: Partial<IPerformanceSession> = {},
): IPerformanceSession => ({
    exerciseId: 'bench',
    exerciseName: 'Bench press',
    exerciseLogType: ExerciseLogType.WeightAndReps,
    workoutId: 'workout',
    date: new Date('2026-07-11'),
    sets: [{ index: 0, weight: 100, reps: 5 }],
    ...overrides,
});

describe('performance calculations', () => {
    it('calculates max weight, reps, and Epley estimated 1RM', () => {
        expect(calculateSessionMetrics(session())).toEqual({
            maxWeight: 100,
            maxReps: 5,
            estimatedOneRepMax: 116.7,
        });
    });

    it('uses effective bodyweight load for additional and assisted exercises', () => {
        expect(
            calculateSessionMetrics(
                session({
                    exerciseLogType:
                        ExerciseLogType.BodyWeightWithAdditionalWeight,
                    userWeight: 80,
                    sets: [{ index: 0, weight: 20, reps: 5 }],
                }),
            ).maxWeight,
        ).toBe(100);
        expect(
            calculateSessionMetrics(
                session({
                    exerciseLogType: ExerciseLogType.BodyWeightWithAssistance,
                    userWeight: 80,
                    sets: [{ index: 0, weight: 15, reps: 5 }],
                }),
            ).maxWeight,
        ).toBe(65);
    });

    it('reports only metrics that beat previous sessions', () => {
        const previous = session({
            workoutId: 'previous',
            date: new Date('2026-07-01'),
            sets: [{ index: 0, weight: 90, reps: 6 }],
        });
        const records = calculateWorkoutPersonalRecords(
            [session()],
            [previous],
        );
        expect(records.map((record) => record.kind)).toEqual([
            'maxWeight',
            'estimatedOneRepMax',
        ]);
        expect(records[0].previousValue).toBe(90);
    });
});
