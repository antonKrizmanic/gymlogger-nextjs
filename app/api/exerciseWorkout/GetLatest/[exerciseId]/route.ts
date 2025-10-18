import { Prisma } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { prisma } from '@/src/lib/prisma';
import type { IExerciseWorkout } from '@/src/models/domain/workout';
import type { ExerciseLogType } from '@/src/types/enums';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ exerciseId: string }> },
) {
    const params = await props.params;

    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { exerciseId } = params;
        const workoutId = request.nextUrl.searchParams.get('workoutId');

        // Validate exerciseId
        if (!exerciseId) {
            return NextResponse.json(
                { error: 'Exercise ID is required' },
                { status: 400 },
            );
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
                belongsToUserId: loggedInUser.id,
                NOT:
                    workoutId &&
                    workoutId !== 'null' &&
                    workoutId !== 'undefined'
                        ? { workoutId: workoutId }
                        : undefined,
                ...(workout?.date && {
                    workout: {
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
                workout: true,
            },
            take: 1,
        };

        // Execute the query with explicit typing
        const result =
            await prisma.exerciseWorkout.findFirst(exerciseWorkoutQuery);

        if (!result) {
            return NextResponse.json(null, { status: 200 });
        }

        // Map to IExerciseWorkout interface with safe access
        const mappedExerciseWorkout: IExerciseWorkout = {
            exerciseId: result.exerciseId,
            exerciseName: result.exercise?.name,
            exerciseDescription: result.exercise?.description,
            workoutId: result.workoutId,
            exerciseLogType: (result.exercise?.exerciseLogType ??
                0) as ExerciseLogType,
            totalWeight: result.totalWeight
                ? Number(result.totalWeight)
                : undefined,
            totalReps: result.totalReps ? Number(result.totalReps) : undefined,
            totalSets: result.exerciseSets?.length ?? 0,
            note: result.note ?? undefined,
            index: result.index,
            sets: result.exerciseSets
                ? result.exerciseSets.map((set) => ({
                      id: set.id,
                      index: set.index,
                      weight: set.weight ? Number(set.weight) : undefined,
                      reps: set.reps ? Number(set.reps) : undefined,
                      time: set.time ? Number(set.time) : undefined,
                      note: set.note ?? undefined,
                  }))
                : [],
        };

        return NextResponse.json(mappedExerciseWorkout, { status: 200 });
    } catch (error) {
        console.error('Error fetching latest exercise workout:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
