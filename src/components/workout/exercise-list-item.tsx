'use client';

import { Info, PlusCircle, StickyNote, X } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { ExerciseApiService } from '@/src/api/services/exercise-api-service';
import { ExerciseApiWorkoutService } from '@/src/api/services/exercise-workout-api-service';
// IconTextarea no longer used here; CollapsibleNote handles input
import { CollapsibleNote } from '@/src/components/common/collapsible-note';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/src/components/ui/collapsible';
import {
    copyPreviousSets,
    hasMeaningfulExerciseValues,
} from '@/src/lib/workout-source';
import type { IExercise } from '@/src/models/domain/exercise';
import type {
    IExerciseSetCreate,
    IExerciseWorkout,
    IExerciseWorkoutCreate,
} from '@/src/models/domain/workout';
import { ExerciseLogType } from '@/src/types/enums';
import { ExerciseSelect } from './exercise-select';
import { ExerciseSetEdit } from './exercise-set-edit';
import { ExerciseSets } from './exercise-sets';
import { MobileExerciseSetEdit } from './mobile-exercise-set-edit';

interface ExerciseListItemProps {
    exercise: IExerciseWorkoutCreate;
    index: number;
    isDirty?: boolean;
    workoutId: string | null;
    onExerciseChange: (exercise: IExerciseWorkoutCreate, index: number) => void;
    onRemoveExercise: (index: number) => void;
    onAddExercise: (index: number, exerciseId: string) => void;
}

export const ExerciseListItem = memo(function ExerciseListItem({
    exercise,
    index,
    isDirty = false,
    workoutId,
    onExerciseChange,
    onRemoveExercise,
    onAddExercise,
}: ExerciseListItemProps) {
    const [lastExercise, setLastExercise] = useState<IExerciseWorkout | null>(
        null,
    );
    const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(
        null,
    );
    const [isLastWorkoutOpen, setIsLastWorkoutOpen] = useState(false);
    // CollapsibleNote manages notes UI state internally

    useEffect(() => {
        const fetchExerciseData = async () => {
            if (!exercise.exerciseId) return;

            try {
                // Fetch the exercise details
                const exerciseService = new ExerciseApiService();
                const exerciseResponse = await exerciseService.getExercise(
                    exercise.exerciseId,
                );
                setSelectedExercise(exerciseResponse || null);

                // Fetch the last exercise workout
                const exerciseWorkoutService = new ExerciseApiWorkoutService();
                const lastWorkoutResponse =
                    await exerciseWorkoutService.getLatestExerciseWorkout(
                        exercise.exerciseId,
                        workoutId,
                    );
                setLastExercise(lastWorkoutResponse || null);
            } catch (error) {
                console.error('Error fetching exercise data:', error);
                setLastExercise(null);
                setSelectedExercise(null);
            }
        };

        fetchExerciseData();
    }, [exercise.exerciseId, workoutId]);

    // Don't auto-expand notes - let user decide

    const handleExerciseSelect = useCallback(
        async (exerciseId: string) => {
            console.log('Selected exercise ID:', exerciseId);
            // Let the parent component know about the change
            onAddExercise(index, exerciseId);
        },
        [onAddExercise, index],
    );

    const handleNoteValueChange = useCallback(
        (value: string) => {
            onExerciseChange({ ...exercise, note: value }, index);
        },
        [exercise, index, onExerciseChange],
    );

    // Legacy note handlers removed in favor of CollapsibleNote

    const handleAddSet = useCallback(() => {
        const newSet: IExerciseSetCreate = {
            index: exercise.sets?.length || 0,
            note: '',
        };
        const updatedExercise = {
            ...exercise,
            sets: [...(exercise.sets || []), newSet],
        };
        onExerciseChange(updatedExercise, index);
    }, [exercise, index, onExerciseChange]);

    const handleSetChange = useCallback(
        (setIndex: number, updatedSet: IExerciseSetCreate) => {
            const updatedSets = exercise.sets?.map((set, i) =>
                i === setIndex ? updatedSet : set,
            );
            const updatedExercise = { ...exercise, sets: updatedSets };
            onExerciseChange(updatedExercise, index);
        },
        [exercise, index, onExerciseChange],
    );

    const handleCopySet = useCallback(
        (setIndex: number) => {
            const setToCopy = exercise.sets?.[setIndex];

            if (setToCopy) {
                const newSet: IExerciseSetCreate = {
                    ...setToCopy,
                    index: exercise.sets?.length || 0,
                };

                // Add the new set at the end
                const updatedSets = [...(exercise.sets || []), newSet];

                // Update indices
                updatedSets.forEach((set, i) => {
                    set.index = i;
                });

                const updatedExercise = { ...exercise, sets: updatedSets };
                onExerciseChange(updatedExercise, index);
            }
        },
        [exercise, index, onExerciseChange],
    );

    const handleRemoveSet = useCallback(
        (setIndex: number) => {
            const updatedSets =
                exercise.sets?.filter((_, i) => i !== setIndex) || [];

            // Update indices
            updatedSets.forEach((set, i) => {
                set.index = i;
            });

            const updatedExercise = { ...exercise, sets: updatedSets };
            onExerciseChange(updatedExercise, index);
        },
        [exercise, index, onExerciseChange],
    );

    const handleUseLastSets = useCallback(() => {
        if (!lastExercise?.sets?.length) return;

        if (
            isDirty &&
            hasMeaningfulExerciseValues(exercise) &&
            !window.confirm(
                'Replace the values you entered for this exercise with the last workout?',
            )
        ) {
            return;
        }

        onExerciseChange(
            { ...exercise, sets: copyPreviousSets(lastExercise.sets) },
            index,
        );
    }, [exercise, index, isDirty, lastExercise, onExerciseChange]);

    // Get the exercise type for the sets - memoized for performance
    const exerciseLogType = useMemo(
        () =>
            selectedExercise?.exerciseLogType || ExerciseLogType.WeightAndReps,
        [selectedExercise?.exerciseLogType],
    );

    // Memoize exercise display properties
    const exerciseDisplayProps = useMemo(
        () => ({
            hasDescription: Boolean(selectedExercise?.description),
            description: selectedExercise?.description,
            hasSets: Boolean(exercise.sets?.length),
            setsCount: exercise.sets?.length || 0,
        }),
        [selectedExercise?.description, exercise.sets?.length],
    );

    return (
        <Card className="border-0 border-b-1 rounded-none p-0 pb-4 bg-gradient-to-br from-card to-card/80 overflow-hidden">
            <CardHeader className="pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground">
                    {index + 1}. Exercise
                </CardTitle>
                {/* Remove button */}
                <Button
                    type="button"
                    onClick={() => onRemoveExercise(index)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Remove exercise</span>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
                {/* Exercise selection */}
                <div className="w-full">
                    <ExerciseSelect
                        selectedExerciseId={exercise.exerciseId}
                        onExerciseSelect={(exerciseId) =>
                            handleExerciseSelect(exerciseId)
                        }
                        required
                    />
                </div>

                {exerciseDisplayProps.hasDescription && (
                    <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary/20">
                        <p className="text-sm text-muted-foreground">
                            {exerciseDisplayProps.description}
                        </p>
                    </div>
                )}

                {/* Notes field */}
                <CollapsibleNote
                    label="Exercise Notes"
                    value={exercise.note || ''}
                    onChange={handleNoteValueChange}
                    icon={StickyNote}
                    placeholder="Add notes for this exercise..."
                />

                {lastExercise && (
                    <div className="space-y-2 p-2">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                type="button"
                                className="flex flex-1 justify-between p-2"
                                onClick={() =>
                                    setIsLastWorkoutOpen((open) => !open)
                                }
                            >
                                <span className="text-sm font-medium">
                                    Last workout
                                </span>
                                <Info className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleUseLastSets}
                            >
                                Use last sets
                            </Button>
                        </div>
                        <Collapsible
                            open={isLastWorkoutOpen}
                            onOpenChange={setIsLastWorkoutOpen}
                        >
                            <CollapsibleTrigger className="sr-only">
                                Toggle previous workout
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <ExerciseSets exercise={lastExercise} />
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                )}

                {/* Sets section */}
                {exercise.exerciseId && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Sets</h3>
                        </div>

                        {/* Desktop view - show the original set editor */}
                        <div className="hidden md:block space-y-2">
                            {exercise.sets?.map((set, setIndex) => (
                                <ExerciseSetEdit
                                    key={setIndex}
                                    set={set}
                                    index={setIndex}
                                    exerciseType={exerciseLogType}
                                    previousSet={lastExercise?.sets?.[setIndex]}
                                    onSetChange={(updatedSet) =>
                                        handleSetChange(setIndex, updatedSet)
                                    }
                                    onCopy={() => handleCopySet(setIndex)}
                                    onRemove={() => handleRemoveSet(setIndex)}
                                />
                            ))}
                        </div>

                        <div className="space-y-3 md:hidden">
                            {exercise.sets?.map((set, setIndex) => (
                                <MobileExerciseSetEdit
                                    key={setIndex}
                                    set={set}
                                    index={setIndex}
                                    exerciseType={exerciseLogType}
                                    previousSet={lastExercise?.sets?.[setIndex]}
                                    onSetChange={(updatedSet) =>
                                        handleSetChange(setIndex, updatedSet)
                                    }
                                    onCopy={() => handleCopySet(setIndex)}
                                    onRemove={() => handleRemoveSet(setIndex)}
                                />
                            ))}
                            {!exercise.sets?.length && (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No sets added yet
                                </p>
                            )}
                        </div>

                        <Button
                            type="button"
                            onClick={handleAddSet}
                            variant="outline"
                            className="w-full"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Set
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
