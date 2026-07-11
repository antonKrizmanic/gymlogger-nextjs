import type {
    IExerciseSet,
    IExerciseSetCreate,
    IExerciseWorkoutCreate,
    IWorkout,
    IWorkoutCreate,
    WorkoutCreateSource,
} from '@/src/models/domain/workout';
import type { IWorkoutTemplate } from '@/src/models/domain/workout-template';

export function resolveWorkoutCreateSource(
    templateId?: string,
    repeatWorkoutId?: string,
): { source: WorkoutCreateSource; error?: string } {
    if (templateId && repeatWorkoutId) {
        return {
            source: null,
            error: 'Choose either a template or a previous workout, not both.',
        };
    }
    if (templateId) return { source: { type: 'template', id: templateId } };
    if (repeatWorkoutId)
        return { source: { type: 'repeat', id: repeatWorkoutId } };
    return { source: null };
}

export function createWorkoutFromTemplate(
    template: IWorkoutTemplate,
): IWorkoutCreate {
    return {
        name: template.name,
        description: '',
        date: new Date(),
        exercises: [...template.exercises]
            .sort((a, b) => a.index - b.index)
            .map((exercise, index) => ({
                exerciseId: exercise.exerciseId,
                index,
                note: '',
                sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
                    index: setIndex,
                    weight: 0,
                    reps: exercise.reps,
                    time: 0,
                    note: '',
                })),
            })),
    };
}

export function createWorkoutFromPrevious(workout: IWorkout): IWorkoutCreate {
    return {
        name: workout.name || '',
        description: '',
        date: new Date(),
        exercises: [...workout.exercises]
            .sort((a, b) => a.index - b.index)
            .map((exercise, index) => ({
                exerciseId: exercise.exerciseId,
                index,
                note: '',
                sets: copyPreviousSets(exercise.sets || []),
            })),
    };
}

export function copyPreviousSets(
    sets: ReadonlyArray<IExerciseSet | IExerciseSetCreate>,
): IExerciseSetCreate[] {
    return [...sets]
        .sort((a, b) => a.index - b.index)
        .map((set, index) => ({
            index,
            weight: set.weight,
            reps: set.reps,
            time: set.time,
            note: '',
        }));
}

export function hasMeaningfulExerciseValues(
    exercise: IExerciseWorkoutCreate,
): boolean {
    return Boolean(
        exercise.note ||
            exercise.sets?.some(
                (set) =>
                    set.weight !== undefined ||
                    set.reps !== undefined ||
                    set.time !== undefined ||
                    Boolean(set.note),
            ),
    );
}
