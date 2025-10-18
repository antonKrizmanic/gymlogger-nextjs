'use client';

import { Clock, Hash, StickyNote, Weight } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { IconInput } from '@/src/components/ui/icon-input';
import type { IExerciseSetCreate } from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '../ui/sheet';

interface ExerciseSetSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    set: IExerciseSetCreate;
    index: number;
    exerciseType: ExerciseLogType;
    onSave: (set: IExerciseSetCreate) => void;
    isNew?: boolean;
}

export function ExerciseSetSheet({
    open,
    onOpenChange,
    set,
    index,
    exerciseType,
    onSave,
    isNew = false,
}: ExerciseSetSheetProps) {
    const [localSet, setLocalSet] = useState<IExerciseSetCreate>(set);
    const firstFieldRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalSet(set);
    }, [set]);

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = e.target.value ? Number(e.target.value) : undefined;
        setLocalSet({ ...localSet, weight });
    };

    const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reps = e.target.value ? Number(e.target.value) : undefined;
        setLocalSet({ ...localSet, reps });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value ? Number(e.target.value) : undefined;
        setLocalSet({ ...localSet, time });
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const note = e.target.value;
        setLocalSet({ ...localSet, note });
    };

    const handleSave = () => {
        onSave(localSet);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="border-t-2 border-primary/20 flex h-screen w-full flex-col overflow-y-auto p-0"
            >
                <SheetHeader className="space-y-2 px-6 pt-6 text-center sm:text-center">
                    <SheetTitle className="text-xl font-bold">
                        {isNew ? 'Add New Set' : `Edit Set ${index + 1}`}
                    </SheetTitle>
                </SheetHeader>
                <SetForm
                    exerciseType={exerciseType}
                    localSet={localSet}
                    firstFieldRef={firstFieldRef}
                    handleWeightChange={handleWeightChange}
                    handleRepsChange={handleRepsChange}
                    handleTimeChange={handleTimeChange}
                    handleNoteChange={handleNoteChange}
                />
                <SheetFooter className="flex-col gap-3 px-6 pt-6 pb-6 sm:flex-col">
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="h-12 text-base font-semibold"
                    >
                        {isNew ? 'Add Set' : 'Save Changes'}
                    </Button>
                    <SheetClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-12 text-base border-2"
                        >
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

interface SetFormProps {
    exerciseType: ExerciseLogType;
    localSet: IExerciseSetCreate;
    firstFieldRef: React.MutableRefObject<HTMLInputElement | null>;
    handleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRepsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNoteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SetForm({
    exerciseType,
    localSet,
    firstFieldRef,
    handleWeightChange,
    handleRepsChange,
    handleTimeChange,
    handleNoteChange,
}: SetFormProps) {
    return (
        <div className="grid gap-6 px-6 py-4">
            {exerciseType === ExerciseLogType.WeightAndReps && (
                <div className="grid grid-cols-1 gap-4">
                    <IconInput
                        icon={Hash}
                        label="Repetitions"
                        id="reps"
                        name="reps"
                        type="number"
                        inputMode="numeric"
                        value={localSet.reps || ''}
                        onChange={handleRepsChange}
                        placeholder="0"
                        ref={firstFieldRef}
                    />
                    <IconInput
                        icon={Weight}
                        label="Weight (kg)"
                        id="weight"
                        name="weight"
                        type="number"
                        value={localSet.weight || ''}
                        onChange={handleWeightChange}
                        placeholder="0"
                    />
                </div>
            )}

            {exerciseType === ExerciseLogType.BodyWeight && (
                <>
                    <IconInput
                        icon={Hash}
                        label="Repetitions"
                        id="reps"
                        name="reps"
                        type="number"
                        inputMode="numeric"
                        value={localSet.reps || ''}
                        onChange={handleRepsChange}
                        placeholder="0"
                        ref={firstFieldRef}
                    />
                    <p className="text-sm text-muted-foreground">
                        Note: Body weight will be automatically calculated and
                        added to total weight.
                    </p>
                </>
            )}

            {exerciseType ===
                ExerciseLogType.BodyWeightWithAdditionalWeight && (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        <IconInput
                            icon={Hash}
                            label="Repetitions"
                            id="reps"
                            name="reps"
                            type="number"
                            inputMode="numeric"
                            value={localSet.reps || ''}
                            onChange={handleRepsChange}
                            placeholder="0"
                            ref={firstFieldRef}
                        />
                        <IconInput
                            icon={Weight}
                            label="Additional Weight (kg)"
                            id="weight"
                            name="weight"
                            type="number"
                            value={localSet.weight || ''}
                            onChange={handleWeightChange}
                            placeholder="0"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Note: Your body weight will be added to the additional
                        weight for total weight calculation.
                    </p>
                </>
            )}

            {exerciseType === ExerciseLogType.BodyWeightWithAssistance && (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        <IconInput
                            icon={Hash}
                            label="Repetitions"
                            id="reps"
                            name="reps"
                            type="number"
                            inputMode="numeric"
                            value={localSet.reps || ''}
                            onChange={handleRepsChange}
                            placeholder="0"
                            ref={firstFieldRef}
                        />
                        <IconInput
                            icon={Weight}
                            label="Assistance Weight (kg)"
                            id="weight"
                            name="weight"
                            type="number"
                            value={localSet.weight || ''}
                            onChange={handleWeightChange}
                            placeholder="0"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Note: Assistance weight will be subtracted from your
                        body weight for total weight calculation.
                    </p>
                </>
            )}

            {exerciseType === ExerciseLogType.RepsOnly && (
                <IconInput
                    icon={Hash}
                    label="Repetitions"
                    id="reps"
                    name="reps"
                    type="number"
                    inputMode="numeric"
                    value={localSet.reps || ''}
                    onChange={handleRepsChange}
                    placeholder="0"
                    ref={firstFieldRef}
                />
            )}

            {exerciseType === ExerciseLogType.TimeOnly && (
                <IconInput
                    icon={Clock}
                    label="Time (seconds)"
                    id="time"
                    name="time"
                    type="number"
                    inputMode="numeric"
                    value={localSet.time || ''}
                    onChange={handleTimeChange}
                    placeholder="0"
                    ref={firstFieldRef}
                />
            )}

            <IconInput
                icon={StickyNote}
                label="Set Notes"
                id="note"
                name="note"
                value={localSet.note || ''}
                onChange={handleNoteChange}
                placeholder="Add notes for this set..."
            />
        </div>
    );
}
