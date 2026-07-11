'use client';

import { Copy, Trash2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import type {
    IExerciseSet,
    IExerciseSetCreate,
} from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';

interface MobileExerciseSetEditProps {
    set: IExerciseSetCreate;
    index: number;
    exerciseType: ExerciseLogType;
    previousSet?: IExerciseSet;
    onSetChange: (set: IExerciseSetCreate) => void;
    onCopy: () => void;
    onRemove: () => void;
}

const parseNumber = (event: ChangeEvent<HTMLInputElement>) =>
    event.target.value === '' ? undefined : Number(event.target.value);

export function MobileExerciseSetEdit({
    set,
    index,
    exerciseType,
    previousSet,
    onSetChange,
    onCopy,
    onRemove,
}: MobileExerciseSetEditProps) {
    const showsReps = exerciseType !== ExerciseLogType.TimeOnly;
    const showsWeight = [
        ExerciseLogType.WeightAndReps,
        ExerciseLogType.BodyWeightWithAdditionalWeight,
        ExerciseLogType.BodyWeightWithAssistance,
    ].includes(exerciseType);
    const showsTime = exerciseType === ExerciseLogType.TimeOnly;

    return (
        <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">Set {index + 1}</p>
                    {previousSet && (
                        <p className="text-xs text-muted-foreground">
                            Previous: {previousSet.reps ?? '—'} reps
                            {previousSet.weight !== undefined
                                ? ` × ${previousSet.weight} kg`
                                : ''}
                            {previousSet.time !== undefined
                                ? ` · ${previousSet.time} sec`
                                : ''}
                        </p>
                    )}
                </div>
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onCopy}
                        aria-label={`Copy set ${index + 1}`}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={onRemove}
                        aria-label={`Remove set ${index + 1}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {showsReps && (
                    <div className="space-y-1">
                        <Label htmlFor={`mobile-set-${index}-reps`}>Reps</Label>
                        <Input
                            id={`mobile-set-${index}-reps`}
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={set.reps ?? ''}
                            onChange={(event) =>
                                onSetChange({
                                    ...set,
                                    reps: parseNumber(event),
                                })
                            }
                            className="h-12 text-lg"
                        />
                    </div>
                )}
                {showsWeight && (
                    <div className="space-y-1">
                        <Label htmlFor={`mobile-set-${index}-weight`}>
                            {exerciseType ===
                            ExerciseLogType.BodyWeightWithAssistance
                                ? 'Assistance (kg)'
                                : exerciseType ===
                                    ExerciseLogType.BodyWeightWithAdditionalWeight
                                  ? 'Additional weight (kg)'
                                  : 'Weight (kg)'}
                        </Label>
                        <Input
                            id={`mobile-set-${index}-weight`}
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.25"
                            value={set.weight ?? ''}
                            onChange={(event) =>
                                onSetChange({
                                    ...set,
                                    weight: parseNumber(event),
                                })
                            }
                            className="h-12 text-lg"
                        />
                    </div>
                )}
                {showsTime && (
                    <div className="col-span-2 space-y-1">
                        <Label htmlFor={`mobile-set-${index}-time`}>
                            Time (seconds)
                        </Label>
                        <Input
                            id={`mobile-set-${index}-time`}
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={set.time ?? ''}
                            onChange={(event) =>
                                onSetChange({
                                    ...set,
                                    time: parseNumber(event),
                                })
                            }
                            className="h-12 text-lg"
                        />
                    </div>
                )}
            </div>

            <details>
                <summary className="cursor-pointer text-sm text-muted-foreground">
                    Set note
                </summary>
                <Input
                    className="mt-2"
                    value={set.note || ''}
                    placeholder="Optional note"
                    onChange={(event) =>
                        onSetChange({ ...set, note: event.target.value })
                    }
                />
            </details>
        </div>
    );
}
