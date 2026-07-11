import { describe, expect, it } from 'vitest';
import {
    createWorkoutDraft,
    parseWorkoutDraft,
    WORKOUT_DRAFT_TTL_MS,
} from './workout-draft';

describe('workout drafts', () => {
    const now = new Date('2026-07-11T12:00:00.000Z');

    it('restores a valid user-scoped draft and its date', () => {
        const draft = createWorkoutDraft(
            'user-1',
            { type: 'template', id: 'template-1' },
            { name: 'Push', date: now, exercises: [] },
            now,
        );
        const parsed = parseWorkoutDraft(JSON.stringify(draft), 'user-1', now);
        expect(parsed?.values.date).toBeInstanceOf(Date);
        expect(parsed?.source).toEqual({ type: 'template', id: 'template-1' });
    });

    it('rejects drafts for another user or older than seven days', () => {
        const draft = createWorkoutDraft(
            'user-1',
            null,
            { name: 'Push', date: now, exercises: [] },
            now,
        );
        expect(
            parseWorkoutDraft(JSON.stringify(draft), 'user-2', now),
        ).toBeNull();
        expect(
            parseWorkoutDraft(
                JSON.stringify(draft),
                'user-1',
                new Date(now.getTime() + WORKOUT_DRAFT_TTL_MS + 1),
            ),
        ).toBeNull();
    });
});
