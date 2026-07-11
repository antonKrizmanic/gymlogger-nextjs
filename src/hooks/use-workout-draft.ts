'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
    createWorkoutDraft,
    getWorkoutDraftKey,
    parseWorkoutDraft,
} from '@/src/lib/workout-draft';
import type {
    IWorkoutDraft,
    WorkoutCreateSource,
} from '@/src/models/domain/workout';
import type { WorkoutSchema } from '@/src/schemas';

interface UseWorkoutDraftOptions {
    enabled: boolean;
    userId?: string;
    source: WorkoutCreateSource;
    form: UseFormReturn<WorkoutSchema>;
}

export function useWorkoutDraft({
    enabled,
    userId,
    source,
    form,
}: UseWorkoutDraftOptions) {
    const [pendingDraft, setPendingDraft] = useState<IWorkoutDraft | null>(
        null,
    );
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );

    const clearDraft = useCallback(() => {
        if (!userId) return;
        window.clearTimeout(saveTimeout.current);
        window.localStorage.removeItem(getWorkoutDraftKey(userId));
        setPendingDraft(null);
        setLastSavedAt(null);
    }, [userId]);

    useEffect(() => {
        if (!enabled || !userId) return;
        const key = getWorkoutDraftKey(userId);
        const draft = parseWorkoutDraft(
            window.localStorage.getItem(key),
            userId,
        );
        if (draft) {
            setPendingDraft(draft);
        } else {
            window.localStorage.removeItem(key);
        }
    }, [enabled, userId]);

    useEffect(() => {
        if (!enabled || !userId || pendingDraft) return;

        const subscription = form.watch((values) => {
            window.clearTimeout(saveTimeout.current);
            saveTimeout.current = setTimeout(() => {
                const draft = createWorkoutDraft(
                    userId,
                    source,
                    values as WorkoutSchema,
                );
                window.localStorage.setItem(
                    getWorkoutDraftKey(userId),
                    JSON.stringify(draft),
                );
                setLastSavedAt(new Date(draft.savedAt));
            }, 750);
        });

        return () => {
            window.clearTimeout(saveTimeout.current);
            subscription.unsubscribe();
        };
    }, [enabled, form, pendingDraft, source, userId]);

    const resumeDraft = useCallback(() => {
        if (!pendingDraft) return null;
        form.reset(pendingDraft.values as WorkoutSchema);
        setLastSavedAt(new Date(pendingDraft.savedAt));
        const resumedSource = pendingDraft.source;
        setPendingDraft(null);
        return resumedSource;
    }, [form, pendingDraft]);

    const discardDraft = useCallback(() => {
        clearDraft();
    }, [clearDraft]);

    return {
        pendingDraft,
        lastSavedAt,
        resumeDraft,
        discardDraft,
        clearDraft,
    };
}
