import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    findUnique: vi.fn(),
    getLoggedInUser: vi.fn(),
}));

vi.mock('@/src/lib/prisma', () => ({
    prisma: { workout: { findUnique: mocks.findUnique } },
}));

vi.mock('./loggedInUser', () => ({
    getLoggedInUser: mocks.getLoggedInUser,
}));

import { getWorkout } from './workout';

describe('getWorkout', () => {
    beforeEach(() => {
        mocks.getLoggedInUser.mockResolvedValue({ id: 'user-1' });
        mocks.findUnique.mockResolvedValue({
            id: 'workout-1',
            name: 'Push',
            description: null,
            date: new Date('2026-07-11'),
            muscleGroupId: 'group-1',
            totalWeight: 0,
            totalReps: 0,
            totalSets: 0,
            userWeight: 80,
            muscleGroup: { name: 'Chest' },
            exerciseWorkouts: [],
        });
    });

    it('scopes repeated-workout loading to the logged-in user', async () => {
        await getWorkout('workout-1');
        expect(mocks.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    id: 'workout-1',
                    belongsToUserId: 'user-1',
                },
            }),
        );
    });

    it('returns null when an owned workout source is unavailable', async () => {
        mocks.findUnique.mockResolvedValue(null);
        await expect(getWorkout('missing')).resolves.toBeNull();
    });
});
