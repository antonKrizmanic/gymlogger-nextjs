import type {
    IWorkoutCreate,
    IWorkoutDraft,
    WorkoutCreateSource,
} from '@/src/models/domain/workout';

export const WORKOUT_DRAFT_VERSION = 1 as const;
export const WORKOUT_DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const getWorkoutDraftKey = (userId: string) =>
    `gymnotebook:workout-draft:${userId}`;

export function createWorkoutDraft(
    userId: string,
    source: WorkoutCreateSource,
    values: IWorkoutCreate,
    savedAt = new Date(),
): IWorkoutDraft {
    return {
        version: WORKOUT_DRAFT_VERSION,
        userId,
        source,
        values,
        savedAt: savedAt.toISOString(),
    };
}

export function parseWorkoutDraft(
    serialized: string | null,
    userId: string,
    now = new Date(),
): IWorkoutDraft | null {
    if (!serialized) return null;

    try {
        const draft = JSON.parse(serialized) as IWorkoutDraft;
        const savedAt = new Date(draft.savedAt);
        if (
            draft.version !== WORKOUT_DRAFT_VERSION ||
            draft.userId !== userId ||
            Number.isNaN(savedAt.getTime()) ||
            now.getTime() - savedAt.getTime() > WORKOUT_DRAFT_TTL_MS ||
            !draft.values ||
            !Array.isArray(draft.values.exercises)
        ) {
            return null;
        }

        return {
            ...draft,
            values: {
                ...draft.values,
                date: draft.values.date
                    ? new Date(draft.values.date)
                    : new Date(),
            },
        };
    } catch {
        return null;
    }
}
