import { Activity } from 'lucide-react';
import type { IExerciseWorkout } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';

interface ExerciseSetsProps {
    exercise: IExerciseWorkout;
}

export function ExerciseSets({ exercise }: ExerciseSetsProps) {
    if (!exercise.sets || exercise.sets.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-muted/50 rounded-full">
                        <Activity className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                            No Sets Recorded
                        </p>
                        <p className="text-xs text-muted-foreground">
                            This exercise doesn&apos;t have any sets logged yet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const exerciseType =
        exercise.exerciseLogType || ExerciseLogType.WeightAndReps;

    type Column = { key: string; label: string; className?: string };

    const columns: Column[] = (() => {
        const cols: Column[] = [
            { key: 'index', label: 'Set', className: 'w-16 shrink-0' },
        ];

        if (exerciseType === ExerciseLogType.WeightAndReps) {
            cols.push({ key: 'reps', label: 'Reps', className: 'flex-1' });
            cols.push({ key: 'weight', label: 'Weight', className: 'flex-1' });
        }
        if (exerciseType === ExerciseLogType.BodyWeight) {
            cols.push({ key: 'reps', label: 'Reps', className: 'flex-1' });
        }
        if (exerciseType === ExerciseLogType.BodyWeightWithAdditionalWeight) {
            cols.push({ key: 'reps', label: 'Reps', className: 'flex-1' });
            cols.push({
                key: 'additionalWeight',
                label: 'Additional',
                className: 'flex-1',
            });
        }
        if (exerciseType === ExerciseLogType.BodyWeightWithAssistance) {
            cols.push({ key: 'reps', label: 'Reps', className: 'flex-1' });
            cols.push({
                key: 'assistanceWeight',
                label: 'Assistance',
                className: 'flex-1',
            });
        }
        if (exerciseType === ExerciseLogType.RepsOnly) {
            cols.push({ key: 'reps', label: 'Reps', className: 'flex-1' });
        }
        if (exerciseType === ExerciseLogType.TimeOnly) {
            cols.push({ key: 'time', label: 'Time', className: 'flex-1' });
        }

        cols.push({ key: 'note', label: 'Notes', className: 'flex-[2]' });
        return cols;
    })();

    const renderCell = (key: string, set: any) => {
        switch (key) {
            case 'index':
                return (
                    <span className="font-bold text-primary">
                        {(set.index ?? 0) + 1}
                    </span>
                );
            case 'reps':
                return <span className="font-medium">{set.reps ?? '-'}</span>;
            case 'weight':
                return (
                    <span className="font-medium">
                        {set.weight ?? '-'} {set.weight != null ? 'kg' : ''}
                    </span>
                );
            case 'additionalWeight':
                return (
                    <span className="font-medium">
                        {set.weight ?? '-'} {set.weight != null ? 'kg' : ''}
                    </span>
                );
            case 'assistanceWeight':
                return (
                    <span className="font-medium">
                        {set.weight ?? '-'} {set.weight != null ? 'kg' : ''}
                    </span>
                );
            case 'time':
                return (
                    <span className="font-medium">
                        {set.time != null ? `${set.time}s` : '-'}
                    </span>
                );
            case 'note':
                return (
                    <span className="text-sm text-muted-foreground">
                        {set.note || '-'}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {/* Desktop: grid-like list */}
            <div className="hidden md:block">
                <div className="rounded-lg border bg-card">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-t-lg">
                        {columns.map((col) => (
                            <div
                                key={col.key}
                                className={`text-xs uppercase tracking-wide text-muted-foreground font-semibold ${col.className || 'flex-1'}`}
                            >
                                {col.label}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="divide-y">
                        {exercise.sets.map((set) => (
                            <div
                                key={set.id ?? set.index}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20"
                            >
                                {columns.map((col) => (
                                    <div
                                        key={col.key}
                                        className={`${col.className || 'flex-1'}`}
                                    >
                                        {renderCell(col.key, set)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile: card list */}
            <div className="md:hidden space-y-3">
                {exercise.sets.map((set) => (
                    <div
                        key={set.id ?? set.index}
                        className="rounded-lg border p-3 bg-card"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">
                                Set {(set.index ?? 0) + 1}
                            </span>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                {exerciseType ===
                                    ExerciseLogType.WeightAndReps && (
                                    <>
                                        <span className="px-2 py-1 rounded bg-muted/50">
                                            Reps: {set.reps ?? '-'}
                                        </span>
                                        <span className="px-2 py-1 rounded bg-muted/50">
                                            Weight: {set.weight ?? '-'}
                                            {set.weight != null ? ' kg' : ''}
                                        </span>
                                    </>
                                )}
                                {exerciseType ===
                                    ExerciseLogType.BodyWeight && (
                                    <span className="px-2 py-1 rounded bg-muted/50">
                                        Reps: {set.reps ?? '-'}
                                    </span>
                                )}
                                {exerciseType ===
                                    ExerciseLogType.BodyWeightWithAdditionalWeight && (
                                    <>
                                        <span className="px-2 py-1 rounded bg-muted/50">
                                            Reps: {set.reps ?? '-'}
                                        </span>
                                        <span className="px-2 py-1 rounded bg-muted/50">
                                            Additional: {set.weight ?? '-'}
                                            {set.weight != null ? ' kg' : ''}
                                        </span>
                                    </>
                                )}
                                {exerciseType ===
                                    ExerciseLogType.BodyWeightWithAssistance && (
                                    <>
                                        <span className="px-2 py-1 rounded bg-muted/50">
                                            Reps: {set.reps ?? '-'}
                                        </span>
                                        <span className="px-2 py-1 rounded bg-muted/50">
                                            Assistance: {set.weight ?? '-'}
                                            {set.weight != null ? ' kg' : ''}
                                        </span>
                                    </>
                                )}
                                {exerciseType === ExerciseLogType.RepsOnly && (
                                    <span className="px-2 py-1 rounded bg-muted/50">
                                        Reps: {set.reps ?? '-'}
                                    </span>
                                )}
                                {exerciseType === ExerciseLogType.TimeOnly && (
                                    <span className="px-2 py-1 rounded bg-muted/50">
                                        Time:{' '}
                                        {set.time != null
                                            ? `${set.time}s`
                                            : '-'}
                                    </span>
                                )}
                            </div>
                        </div>
                        {set.note && (
                            <div className="text-xs text-muted-foreground">
                                {set.note}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
