import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/src/lib/auth';

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Add muscle group filter if provided
        if (muscleGroupId) {
            where.muscleGroupId = muscleGroupId;
        }

        // Add date filter if provided
        if (workoutDate) {
            const startOfDay = new Date(workoutDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(workoutDate);
            endOfDay.setHours(23, 59, 59, 999);

            where.date = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        // Get total count for pagination
        const totalItems = await prisma.workout.count({ where });

        // Get workouts with pagination
        const workouts = await prisma.workout.findMany({
            where,
            include: {
                muscleGroup: {
                    select: {
                        name: true
                    }
                },
                exerciseWorkouts: {
                    include: {
                        exercise: {
                            select: {
                                name: true
                            }
                        },
                        exerciseSets: true
                    }
                }
            },
            orderBy: {
                date: sortDirection
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
            workout.exerciseWorkouts.forEach(ew => {
                ew.exerciseSets.forEach(set => {
                    totalWeight += Number(set.weight) || 0;
                    totalReps += Number(set.reps) || 0;
                    totalSets += 1;
                });
            });

            return {
                id: workout.id,
                name: workout.name,
                description: workout.description,
                date: workout.date,
                muscleGroupId: workout.muscleGroupId,
                muscleGroupName: workout.muscleGroup?.name,
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
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await request.json();

        // Calculate total reps, weight, and sets
        const exercises = data.exercises.map((exercise: any) => {
            const totalReps = exercise.sets.reduce((acc: number, set: any) => acc + (set.reps || 0), 0);
            const totalWeight = exercise.sets.reduce((acc: number, set: any) => acc + ((set.weight || 0) * (set.reps || 0)), 0);
            const totalSets = exercise.sets.length;
            return {
                ...exercise,
                totalReps,
                totalWeight,
                totalSets
            };
        });
        const exerciseIds = exercises.map((exercise: any) => exercise.exerciseId);
        const exercisesInDb = await prisma.exercise.findMany({
            select: {
                id: true,
                muscleGroupId: true
            },
            where: {
                id: {
                    in: exerciseIds
                }
            }
        });

        // Get most often used muscle group
        const mostTrainedMuscleGroup = exercisesInDb.reduce((acc: any, exercise: any) => {
            if (!acc[exercise.muscleGroupId]) {
                acc[exercise.muscleGroupId] = 0;
            }
            acc[exercise.muscleGroupId] += 1;
            return acc;
        });
        const muscleGroup = mostTrainedMuscleGroup.muscleGroupId;


        const totalReps = exercises.reduce((acc: number, exercise: any) => acc + (exercise.totalReps || 0), 0);
        const totalWeight = exercises.reduce((acc: number, exercise: any) => acc + (exercise.totalWeight || 0), 0);
        const totalSets = exercises.reduce((acc: number, exercise: any) => acc + (exercise.totalSets || 0), 0);


        // Create workout
        const workout = await prisma.workout.create({
            data: {
                id: uuidv4(),
                name: data.name,
                muscleGroup: {
                    connect: {
                        id: muscleGroup
                    }
                },
                //MuscleGroupId: muscleGroup,
                description: data.description,
                totalReps: totalReps,
                totalWeight: totalWeight,
                totalSets: totalSets,
                date: new Date(data.date),
                createdAt: new Date(),
                updatedAt: new Date,
                exerciseWorkouts: {
                    create: exercises.map((exercise: any) => ({
                        id: uuidv4(),
                        exercise: {
                            connect: {
                                id: exercise.exerciseId
                            }
                        },
                        index: exercise.index,
                        note: exercise.note,
                        totalReps: exercise.totalReps,
                        totalWeight: exercise.totalWeight,
                        totalSets: exercise.totalSets,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        exerciseSets: {
                            create: exercise.sets.map((set: any) => ({
                                id: uuidv4(),
                                index: set.index,
                                time: set.time,
                                weight: set.weight,
                                reps: set.reps,
                                note: set.note,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }))
                        }
                    }))
                }
            }
        });

        return NextResponse.json({ message: 'Workout created', workout });
    } catch (error) {
        console.error('Error creating workout:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}