import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { get } from 'http';
import { getPagedWorkouts } from '@/src/data/workout';
import { SortDirection } from '@/src/types/enums';

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = request.nextUrl;
        const page = Number(searchParams.get('page')) || 0;
        const pageSize = Number(searchParams.get('pageSize')) || 12;
        const search = searchParams.get('search') || '';
        const muscleGroupId = searchParams.get('muscleGroupId') || undefined;
        const workoutDateParam = searchParams.get('workoutDate');
        const workoutDate = workoutDateParam ? new Date(workoutDateParam) : undefined;

        const result = await getPagedWorkouts({
            page,
            pageSize,
            search,
            muscleGroupId,
            workoutDate,
            sortColumn: "date",
            sortDirection: SortDirection.Descending,
        });

        if (result) {
            return NextResponse.json({
                items: result.items,
                pagingData: result.pagingData,
            });
        }
        else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Keep existing POST function
export async function POST(request: Request) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
                updatedAt: new Date(),
                belongsToUserId: loggedInUser.id,
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
                        belongsToUserId: loggedInUser.id,
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