import { describe, expect, it } from 'vitest';
import type { IWorkout } from '@/src/models/domain/workout';
import type { IWorkoutTemplate } from '@/src/models/domain/workout-template';
import { ExerciseLogType } from '@/src/types/enums';
import {
    copyPreviousSets,
    createWorkoutFromPrevious,
    createWorkoutFromTemplate,
    resolveWorkoutCreateSource,
} from './workout-source';

describe('workout source mapping', () => {
    it('rejects mutually exclusive create sources', () => {
        expect(resolveWorkoutCreateSource('template', 'workout')).toEqual({
            source: null,
            error: 'Choose either a template or a previous workout, not both.',
        });
    });

    it('maps a template in index order with zero weights', () => {
        const template: IWorkoutTemplate = {
            id: 'template',
            name: 'Push',
            belongsToUserId: 'user',
            exercises: [
                {
                    id: 'two',
                    workoutTemplateId: 'template',
                    exerciseId: 'exercise-two',
                    sets: 1,
                    reps: 8,
                    index: 1,
                },
                {
                    id: 'one',
                    workoutTemplateId: 'template',
                    exerciseId: 'exercise-one',
                    sets: 2,
                    reps: 10,
                    index: 0,
                },
            ],
        };

        const result = createWorkoutFromTemplate(template);
        expect(
            result.exercises?.map((exercise) => exercise.exerciseId),
        ).toEqual(['exercise-one', 'exercise-two']);
        expect(result.exercises?.[0].sets).toEqual([
            { index: 0, weight: 0, reps: 10, time: 0, note: '' },
            { index: 1, weight: 0, reps: 10, time: 0, note: '' },
        ]);
    });

    it('repeats performance without historical ids or notes', () => {
        const workout: IWorkout = {
            id: 'workout',
            name: 'Legs',
            description: 'Old workout note',
            date: new Date('2026-01-01'),
            muscleGroupId: 'legs',
            exercises: [
                {
                    exerciseId: 'squat',
                    exerciseName: 'Squat',
                    workoutId: 'workout',
                    exerciseLogType: ExerciseLogType.WeightAndReps,
                    index: 0,
                    note: 'Old exercise note',
                    sets: [
                        {
                            id: 'set-id',
                            index: 0,
                            reps: 5,
                            weight: 100,
                            note: 'Old set note',
                        },
                    ],
                },
            ],
        };

        const result = createWorkoutFromPrevious(workout);
        expect(result.description).toBe('');
        expect(result.exercises?.[0].note).toBe('');
        expect(result.exercises?.[0].sets?.[0]).toEqual({
            index: 0,
            reps: 5,
            weight: 100,
            time: undefined,
            note: '',
        });
        expect(result.exercises?.[0].sets?.[0].id).toBeUndefined();
    });

    it('orders and reindexes copied sets', () => {
        expect(
            copyPreviousSets([
                { id: 'b', index: 1, reps: 8 },
                { id: 'a', index: 0, reps: 10 },
            ]),
        ).toEqual([
            {
                index: 0,
                reps: 10,
                weight: undefined,
                time: undefined,
                note: '',
            },
            { index: 1, reps: 8, weight: undefined, time: undefined, note: '' },
        ]);
    });
});
