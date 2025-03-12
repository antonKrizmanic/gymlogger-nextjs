'use client';
import { cn } from "@/lib/utils";
import { IExerciseSetCreate, IExerciseWorkout, IExerciseWorkoutCreate } from "@/src/Models/Domain/Workout";
import { ExerciseSelect } from "./ExerciseSelect";
import { ExerciseLogType } from "@/src/Types/Enums";
import { ExerciseSetEdit } from "./ExerciseSetEdit";
import { useEffect, useState } from "react";
import { ExerciseWorkoutService } from "@/src/Api/Services/ExerciseWorkoutService";
import { ExerciseSets } from "./ExerciseSets";
import { TextInput } from "../Form/TextInput";
import { IExercise } from "@/src/Models/Domain/Exercise";
import { ExerciseService } from "@/src/Api/Services/ExerciseService";
import { PlusIcon } from "../Icons";
import { ActionButton } from "../Common/ActionButton";
import { CloseIcon } from "../Icons/CloseIcon";

interface ExerciseListItemProps {
    exercise: IExerciseWorkoutCreate;
    index: number;
    workoutId: string | null;
    onExerciseChange: (exercise: IExerciseWorkoutCreate, index: number) => void;
    onRemoveExercise: (index: number) => void;
    onAddExercise: (index: number, exerciseId: string) => void;
}

export function ExerciseListItem({ exercise, index, workoutId, onExerciseChange, onRemoveExercise, onAddExercise }: ExerciseListItemProps) {
    const [lastExercise, setLastExercise] = useState<IExerciseWorkout | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(null);

    useEffect(() => {
        const fetchExerciseData = async () => {
            if (!exercise.exerciseId) return;

            try {
                // Fetch the exercise details
                const exerciseService = new ExerciseService();
                const exerciseResponse = await exerciseService.getExercise(exercise.exerciseId);
                setSelectedExercise(exerciseResponse || null);

                // Fetch the last exercise workout
                const exerciseWorkoutService = new ExerciseWorkoutService();
                const lastWorkoutResponse = await exerciseWorkoutService.getLatestExerciseWorkout(
                    exercise.exerciseId, 
                    workoutId
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

    const handleExerciseSelect = async (exerciseId: string) => {
        // Let the parent component know about the change
        onAddExercise(index, exerciseId);
    };

    const handleNoteChange = (note: string) => {
        exercise.note = note;
        onExerciseChange(exercise, index);
    };

    const handleAddSet = () => {
        const newSet: IExerciseSetCreate = {
            index: exercise.sets?.length || 0,
            note: ''
        };
        exercise.sets = [...(exercise.sets || []), newSet];
        onExerciseChange(exercise, index);
    };

    const handleSetChange = (setIndex: number, updatedSet: IExerciseSetCreate) => {
        exercise.sets = exercise.sets?.map((set, i) =>
            i === setIndex ? updatedSet : set
        );
        onExerciseChange(exercise, index);
    };


    const handleCopySet = (setIndex: number) => {
        const setToCopy = exercise.sets?.[setIndex];

        if (setToCopy) {
            const newSet: IExerciseSetCreate = {
                ...setToCopy,
                index: setIndex + 1
            };

            // Insert the new set after the copied set
            exercise.sets = [
                ...(exercise.sets?.slice(0, setIndex + 1) || []),
                newSet,
                ...(exercise.sets?.slice(setIndex + 1) || [])
            ];

            // Update indices
            exercise.sets.forEach((set, i) => {
                set.index = i;
            });

            onExerciseChange(exercise, index);
        }
    };

    const handleRemoveSet = (setIndex: number) => {
        exercise.sets = exercise.sets?.filter((_, i) => i !== setIndex);

        // Update indices
        exercise.sets?.forEach((set, i) => {
            set.index = i;
        });

        onExerciseChange(exercise, index);
    };

    // Get the exercise type for the sets
    const exerciseLogType = selectedExercise?.exerciseLogType || ExerciseLogType.WeightAndReps;

    return (
        <div
            key={index}
            className={cn(
                'p-4 rounded-lg',
                'bg-white dark:bg-slate-800',
                'border border-gray-300 dark:border-gray-700',
                'space-y-4'
            )}
        >
            <div className="flex items-start gap-4">
                {/* Exercise selection */}
                <div className="flex-1">
                    <ExerciseSelect
                        selectedExerciseId={exercise.exerciseId}
                        onExerciseSelect={(exerciseId) => handleExerciseSelect(exerciseId)}
                        required
                    />
                </div>

                {/* Remove button */}
                <button
                    type="button"
                    onClick={() => onRemoveExercise(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <p>{selectedExercise?.description}</p>
            </div>

            {/* Notes field */}
            <div>
                <TextInput
                    label="Notes"
                    id={`note-${index}`}
                    value={exercise.note}
                    onChange={(value) => handleNoteChange(value)} />
            </div>
            {lastExercise && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Last workout
                            </span>
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform group-open:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <ExerciseSets exercise={lastExercise} />
                        </div>
                    </details>
                </div>
            )}
            {/* Sets section */}
            {exercise.exerciseId && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sets</h3>
                    </div>

                    <div className="space-y-2">
                        {exercise.sets?.map((set, setIndex) => (
                            <ExerciseSetEdit
                                key={setIndex}
                                set={set}
                                index={setIndex}
                                exerciseType={exerciseLogType}
                                onSetChange={(updatedSet) => handleSetChange(setIndex, updatedSet)}
                                onCopy={() => handleCopySet(setIndex)}
                                onRemove={() => handleRemoveSet(setIndex)}
                            />
                        ))}
                    </div>
                    <ActionButton onClick={handleAddSet}>
                        <PlusIcon />
                        Add Set
                    </ActionButton>
                </div>
            )}
        </div>
    );
}
