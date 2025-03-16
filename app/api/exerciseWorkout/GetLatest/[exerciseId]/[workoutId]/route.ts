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
            workout = await prisma.workout.findUnique({
                where: {
                    id: workoutId,
                },
                select: {
                    id: true,
                    date: true,
                },
            });
        }

        // Query to find the latest exercise workout
        const exerciseWorkoutQuery = {            
            where: {
                exerciseId: exerciseId,
                //userId: session.user.id,
                // Exclude the current workout
                NOT: workoutId && workoutId !== 'null' && workoutId !== 'undefined'
                    ? { workoutId: workoutId }
                    : undefined,
                // If we have a workout with a date, only include exercise workouts with earlier dates
                ...(workout?.date && {
                    workouts: {
                        date: {
                            lte: workout.date,
                        },
                    },
                }),
            },
            orderBy: {
                createdAt: Prisma.SortOrder.desc, // Use the proper enum value
            },
            include: {
                exercise: true,
                exerciseSets: true,
                workout: true
            },
            take: 1,
        };

        // Execute the query with explicit typing
        const result = await prisma.exerciseWorkout.findFirst(exerciseWorkoutQuery);
            
        if (!result) {
            return NextResponse.json(null, { status: 200 });
        }

        // Map to IExerciseWorkout interface with safe access
        const mappedExerciseWorkout: IExerciseWorkout = {
            exerciseId: result.exerciseId,
            exerciseName: result.exercise?.name,
            workoutId: result.workoutId,
            exerciseLogType: (result.exercise?.exerciseLogType ?? 0) as ExerciseLogType,
            totalWeight: result.totalWeight ? Number(result.totalWeight) : undefined,
            totalReps: result.totalReps ? Number(result.totalReps) : undefined,
            totalSets: result.exerciseSets?.length ?? 0,
            note: result.note ?? undefined,
            index: result.index,
            sets: result.exerciseSets ? 
                result.exerciseSets.map(set => ({
                    id: set.id,
                    index: set.index,
                    weight: set.weight ? Number(set.weight) : undefined,
                    reps: set.reps ? Number(set.reps) : undefined,
                    time: set.time ? Number(set.time) : undefined,
                    note: set.note ?? undefined,
                })) : [],
        };

        return NextResponse.json(mappedExerciseWorkout, { status: 200 });
    } catch (error) {
        console.error('Error fetching latest exercise workout:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}