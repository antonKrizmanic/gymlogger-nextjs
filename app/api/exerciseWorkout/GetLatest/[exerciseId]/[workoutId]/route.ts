import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { IExerciseWorkout } from '@/src/Models/Domain/Workout';
import { ExerciseLogType } from '@/src/Types/Enums';
import { Prisma } from '@prisma/client';

// Define a type that matches what Prisma actually returns
type PrismaExerciseWorkout = {
  Id: string;
  WorkoutId: string;
  ExerciseId: string;
  TotalWeight: number | null;
  TotalReps: number | null;
  TotalSets: number | null;
  CreatedAt: Date;
  UpdatedAt: Date;
  Note: string | null;
  Index: number;
  BelongsToUserId: string | null;
  Exercises: {
    Id: string;
    Name: string;
    ExerciseLogType: number;
    // Add other fields as needed
  } | null;
  ExerciseSets: Array<{
    Id: string;
    ExerciseWorkoutId: string;
    Index: number;
    Weight: number | null;
    Reps: number | null;
    Time: number | null;
    Note: string | null;
    CreatedAt: Date;
    UpdatedAt: Date;
  }> | null;
  Workouts: {
    Id: string;
    Date: Date;
    // Add other fields as needed
  } | null;
};

export async function GET(
    request: Request,
    props: { params: Promise<{ exerciseId: string; workoutId: string }> }
) {
    const params = await props.params;
    try {
        const { exerciseId, workoutId } = params;
        
        // Validate exerciseId
        if (!exerciseId) {
            return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
        }

        // Get the current workout if workoutId is provided and valid
        let workout = null;
        if (workoutId && workoutId !== 'null' && workoutId !== 'undefined') {
            workout = await prisma.workouts.findUnique({
                where: {
                    Id: workoutId,
                },
                select: {
                    Id: true,
                    Date: true,
                },
            });
        }

        // Query to find the latest exercise workout
        const exerciseWorkoutQuery = {            
            where: {
                ExerciseId: exerciseId,
                //userId: session.user.id,
                // Exclude the current workout
                NOT: workoutId && workoutId !== 'null' && workoutId !== 'undefined'
                    ? { WorkoutId: workoutId }
                    : undefined,
                // If we have a workout with a date, only include exercise workouts with earlier dates
                ...(workout?.Date && {
                    Workouts: {
                        Date: {
                            lte: workout.Date,
                        },
                    },
                }),
            },
            orderBy: {
                CreatedAt: Prisma.SortOrder.desc, // Use the proper enum value
            },
            include: {
                Exercises: true,
                ExerciseSets: true,
                Workouts: true
            },
            take: 1,
        };

        // Execute the query with explicit typing
        const result = await prisma.exerciseWorkouts.findFirst(exerciseWorkoutQuery) as unknown as PrismaExerciseWorkout | null;
            
        if (!result) {
            return NextResponse.json(null, { status: 200 });
        }

        // Map to IExerciseWorkout interface with safe access
        const mappedExerciseWorkout: IExerciseWorkout = {
            exerciseId: result.ExerciseId,
            exerciseName: result.Exercises?.Name,
            workoutId: result.WorkoutId,
            exerciseLogType: (result.Exercises?.ExerciseLogType ?? 0) as ExerciseLogType,
            totalWeight: result.TotalWeight ? Number(result.TotalWeight) : undefined,
            totalReps: result.TotalReps ? Number(result.TotalReps) : undefined,
            totalSets: result.ExerciseSets?.length ?? 0,
            note: result.Note ?? undefined,
            index: result.Index,
            sets: result.ExerciseSets ? 
                result.ExerciseSets.map(set => ({
                    id: set.Id,
                    index: set.Index,
                    weight: set.Weight ? Number(set.Weight) : undefined,
                    reps: set.Reps ? Number(set.Reps) : undefined,
                    time: set.Time ? Number(set.Time) : undefined,
                    note: set.Note ?? undefined,
                })) : [],
        };

        return NextResponse.json(mappedExerciseWorkout, { status: 200 });
    } catch (error) {
        console.error('Error fetching latest exercise workout:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}