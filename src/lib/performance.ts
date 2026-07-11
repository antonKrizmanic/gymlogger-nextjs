import type {
    IExerciseAnalytics,
    IPerformanceSession,
    IPersonalRecord,
    PersonalRecordKind,
} from '@/src/models/domain/performance';
import type { ExerciseLogType } from '@/src/types/enums';
import { ExerciseLogType as LogType } from '@/src/types/enums';

type SessionMetrics = Partial<Record<PersonalRecordKind, number>>;

const RECORD_META: Record<
    PersonalRecordKind,
    { unit: IPersonalRecord['unit'] }
> = {
    maxWeight: { unit: 'kg' },
    maxReps: { unit: 'reps' },
    estimatedOneRepMax: { unit: 'kg' },
    maxTime: { unit: 'seconds' },
};

const effectiveWeight = (
    logType: ExerciseLogType,
    weight: number,
    userWeight: number,
) => {
    if (logType === LogType.BodyWeight) return userWeight;
    if (logType === LogType.BodyWeightWithAdditionalWeight)
        return userWeight + weight;
    if (logType === LogType.BodyWeightWithAssistance)
        return Math.max(0, userWeight - weight);
    return weight;
};

export function calculateSessionMetrics(
    session: IPerformanceSession,
): SessionMetrics {
    const metrics: SessionMetrics = {};
    const userWeight = session.userWeight || 0;

    for (const set of session.sets) {
        const weight = set.weight || 0;
        const reps = set.reps || 0;
        const time = set.time || 0;

        if (session.exerciseLogType === LogType.TimeOnly) {
            metrics.maxTime = Math.max(metrics.maxTime || 0, time);
            continue;
        }

        metrics.maxReps = Math.max(metrics.maxReps || 0, reps);

        if (
            session.exerciseLogType === LogType.RepsOnly ||
            session.exerciseLogType === LogType.BodyWeight
        ) {
            continue;
        }

        const performanceWeight = effectiveWeight(
            session.exerciseLogType,
            weight,
            userWeight,
        );
        metrics.maxWeight = Math.max(metrics.maxWeight || 0, performanceWeight);

        if (reps >= 1 && reps <= 12 && performanceWeight > 0) {
            const estimate = performanceWeight * (1 + reps / 30);
            metrics.estimatedOneRepMax = Math.max(
                metrics.estimatedOneRepMax || 0,
                Math.round(estimate * 10) / 10,
            );
        }
    }

    return metrics;
}

const getBestMetric = (
    sessions: IPerformanceSession[],
    kind: PersonalRecordKind,
) =>
    sessions.reduce(
        (best, session) =>
            Math.max(best, calculateSessionMetrics(session)[kind] || 0),
        0,
    );

export function calculateWorkoutPersonalRecords(
    currentSessions: IPerformanceSession[],
    previousSessions: IPerformanceSession[],
): IPersonalRecord[] {
    return currentSessions.flatMap((session) => {
        const priorForExercise = previousSessions.filter(
            (previous) => previous.exerciseId === session.exerciseId,
        );
        const metrics = calculateSessionMetrics(session);

        return (Object.entries(metrics) as Array<[PersonalRecordKind, number]>)
            .filter(([, value]) => value > 0)
            .flatMap(([kind, value]) => {
                const previousValue = getBestMetric(priorForExercise, kind);
                if (previousValue >= value) return [];
                return [
                    {
                        exerciseId: session.exerciseId,
                        exerciseName: session.exerciseName,
                        kind,
                        value,
                        unit: RECORD_META[kind].unit,
                        previousValue: previousValue || undefined,
                        workoutId: session.workoutId,
                        date: session.date,
                    },
                ];
            });
    });
}

export function calculateExerciseAnalytics(
    sessions: IPerformanceSession[],
): IExerciseAnalytics {
    const ordered = [...sessions].sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
    );
    const latest = ordered[0] ? calculateSessionMetrics(ordered[0]) : {};
    const records: IPersonalRecord[] = [];

    if (!ordered.length) return { latest, records };

    const kinds: PersonalRecordKind[] = [
        'maxWeight',
        'maxReps',
        'estimatedOneRepMax',
        'maxTime',
    ];
    for (const kind of kinds) {
        let bestSession: IPerformanceSession | undefined;
        let bestValue = 0;
        for (const session of ordered) {
            const value = calculateSessionMetrics(session)[kind] || 0;
            if (value > bestValue) {
                bestValue = value;
                bestSession = session;
            }
        }
        if (bestSession && bestValue > 0) {
            records.push({
                exerciseId: bestSession.exerciseId,
                exerciseName: bestSession.exerciseName,
                kind,
                value: bestValue,
                unit: RECORD_META[kind].unit,
                workoutId: bestSession.workoutId,
                date: bestSession.date,
            });
        }
    }

    return { latest, records };
}
