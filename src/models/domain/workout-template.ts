export interface IWorkoutTemplate extends IWorkoutTemplateSimple {
    exercises: IWorkoutTemplateExercise[];
}

export interface IWorkoutTemplateSimple {
    id: string;
    name: string;
    belongsToUserId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IWorkoutTemplateCreate {
    name: string;
    exercises?: IWorkoutTemplateExerciseCreate[];
}

export interface IWorkoutTemplateUpdate extends IWorkoutTemplateCreate {
    id: string;
}

export interface IWorkoutTemplateExercise {
    id: string;
    workoutTemplateId: string;
    exerciseId: string;
    exerciseName?: string;
    exerciseDescription?: string | null;
    sets: number;
    reps: number;
    index: number;
}

export interface IWorkoutTemplateExerciseCreate {
    exerciseId: string;
    sets: number;
    reps: number;
    index: number;
}

// Type for Prisma result
interface PrismaWorkoutTemplateExercise {
    id: string;
    workoutTemplateId: string;
    exerciseId: string;
    sets: number;
    reps: number;
    index: number;
    exercise?: {
        name: string;
        description: string | null;
    };
}

interface PrismaWorkoutTemplate {
    id: string;
    name: string;
    belongsToUserId: string;
    createdAt: Date;
    updatedAt: Date;
    workoutTemplateExercises?: PrismaWorkoutTemplateExercise[];
}

export const mapWorkoutTemplateToIWorkoutTemplate = (
    template: PrismaWorkoutTemplate,
): IWorkoutTemplate => {
    return {
        id: template.id,
        name: template.name,
        belongsToUserId: template.belongsToUserId,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        exercises:
            template.workoutTemplateExercises?.map((exercise) => ({
                id: exercise.id,
                workoutTemplateId: exercise.workoutTemplateId,
                exerciseId: exercise.exerciseId,
                exerciseName: exercise.exercise?.name,
                exerciseDescription: exercise.exercise?.description,
                sets: exercise.sets,
                reps: exercise.reps,
                index: exercise.index,
            })) || [],
    };
};
