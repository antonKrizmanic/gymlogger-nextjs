import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { IExerciseWorkout } from '@/src/Models/Domain/Workout';
import { ExerciseLogType, SortDirection } from '@/src/Types/Enums';
import { Prisma } from '@prisma/client';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { IPagedResponse } from '@/src/Types/Common';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ exerciseId: string }> }
) {  
    const params = await props.params;
  
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { exerciseId } = params;
        const { searchParams } = request.nextUrl;
        const page = Number(searchParams.get('page')) || 0;
        const pageSize = Number(searchParams.get('pageSize')) || 5;
        
        // Validate exerciseId
        if (!exerciseId) {
            return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
        }

        // Count total records for pagination
        const totalItems = await prisma.exerciseWorkout.count({
            where: {
                exerciseId: exerciseId,
                belongsToUserId: loggedInUser.id
            }
        });

        // Get exercise workouts with pagination
        const exerciseWorkouts = await prisma.exerciseWorkout.findMany({
            where: {
                exerciseId: exerciseId,
                belongsToUserId: loggedInUser.id
            },
            orderBy: {
                workout: {
                    date: 'desc'
                }
            },
            include: {
                exercise: true,
                exerciseSets: {
                    orderBy: {
                        index: 'asc'
                    }
                },
                workout: {
                    select: {
                        date: true,
                        name: true,
                        id: true
                    }
                }
            },
            skip: page * pageSize,
            take: pageSize
        });
        
        // Map the data to match the IExerciseWorkout interface
        const mappedExerciseWorkouts = exerciseWorkouts.map(ew => ({
            exerciseId: ew.exerciseId,
            exerciseName: ew.exercise?.name,
            workoutId: ew.workoutId,
            workoutDate: ew.workout?.date,
            workoutName: ew.workout?.name,
            exerciseLogType: (ew.exercise?.exerciseLogType ?? 0) as ExerciseLogType,
            totalWeight: ew.totalWeight ? Number(ew.totalWeight) : undefined,
            totalReps: ew.totalReps ? Number(ew.totalReps) : undefined,
            totalSets: ew.exerciseSets?.length ?? 0,
            note: ew.note ?? undefined,
            index: ew.index,
            sets: ew.exerciseSets ? 
                ew.exerciseSets.map(set => ({
                    id: set.id,
                    index: set.index,
                    weight: set.weight ? Number(set.weight) : undefined,
                    reps: set.reps ? Number(set.reps) : undefined,
                    time: set.time ? Number(set.time) : undefined,
                    note: set.note ?? undefined,
                })) : [],
        }));

        // Create a paged response
        const response: IPagedResponse<IExerciseWorkout> = {
            items: mappedExerciseWorkouts,
            pagingData: {
                page,
                pageSize,
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize),
                search: '',
                sortColumn: 'date',
                sortDirection: SortDirection.Descending,
            }
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching paginated exercise workouts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}