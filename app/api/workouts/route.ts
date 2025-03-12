import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { SortDirection } from '@/src/Types/Enums';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // const session = await getServerSession();
        // if (!session?.user?.email) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const { searchParams } = request.nextUrl;
        const page = Number(searchParams.get('page')) || 0;
        const pageSize = Number(searchParams.get('pageSize')) || 12;
        const search = searchParams.get('search') || '';
        const muscleGroupId = searchParams.get('muscleGroupId') || undefined;
        const workoutDateParam = searchParams.get('workoutDate');
        const workoutDate = workoutDateParam ? new Date(workoutDateParam) : undefined;
        const sortDirection = searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc';

        // Build the where clause
        const where: any = {
            // User: {
            //     email: session.user.email
            // }
        };

        // Add search condition if provided
        if (search) {
            where.OR = [
                { Name: { contains: search, mode: 'insensitive' } },
                { Description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Add muscle group filter if provided
        if (muscleGroupId) {
            where.MuscleGroupId = muscleGroupId;
        }

        // Add date filter if provided
        if (workoutDate) {
            const startOfDay = new Date(workoutDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(workoutDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            where.Date = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        // Get total count for pagination
        const totalItems = await prisma.workouts.count({ where });

        // Get workouts with pagination
        const workouts = await prisma.workouts.findMany({
            where,
            include: {
                MuscleGroups: {
                    select: {
                        Name: true
                    }
                },
                ExerciseWorkouts: {
                    include: {
                        Exercises: {
                            select: {
                                Name: true
                            }
                        },
                        ExerciseSets: true
                    }
                }
            },
            orderBy: {
                Date: sortDirection
            },
            skip: page * pageSize,
            take: pageSize
        });

        // Map and calculate totals
        const mappedWorkouts = workouts.map(workout => {
            let totalWeight = 0;
            let totalReps = 0;
            let totalSets = 0;

            // Calculate totals from exercise sets
            workout.ExerciseWorkouts.forEach(ew => {
                ew.ExerciseSets.forEach(set => {
                    totalWeight += Number(set.Weight) || 0;
                    totalReps += Number(set.Reps) || 0;
                    totalSets += 1;
                });
            });

            return {
                id: workout.Id,
                name: workout.Name,
                description: workout.Description,
                date: workout.Date,
                muscleGroupId: workout.MuscleGroupId,
                muscleGroupName: workout.MuscleGroups?.Name,
                totalWeight,
                totalReps,
                totalSets
            };
        });

        return NextResponse.json({
            items: mappedWorkouts,
            pagingData: {
                page,
                pageSize,
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize)
            }
        });
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Keep existing POST function
export async function POST(request: Request) {
    try {
        const data = await request.json();
        // TODO: Implement workout creation
        return NextResponse.json({ message: 'Workout created' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}