import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { getWorkout } from '@/src/data/workout';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
    try {
        const { id } = params;

        const workout = await getWorkout(id);
        
        if (!workout) {
            return NextResponse.json(
                { message: 'Workout not found' },
                { status: 404 }
            );
        }
        // Map from DB schema to our interface
        return NextResponse.json(workout);
    } catch (error) {
        console.error('Error fetching workout:', error);
        return NextResponse.json(
            { message: 'Failed to fetch workout' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = params;
        const body = await request.json();

        // Validate GUID format
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid GUID format' }, { status: 400 });
        }

        // Calculate total reps, weight, and sets
        const exercises = body.exercises.map((exercise: any) => {
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
        const totalReps = exercises.reduce((acc: number, exercise: any) => acc + (exercise.totalReps || 0), 0);
        const totalWeight = exercises.reduce((acc: number, exercise: any) => acc + (exercise.totalWeight || 0), 0);
        const totalSets = exercises.reduce((acc: number, exercise: any) => acc + (exercise.totalSets || 0), 0);


        // Update workout
        const updatedWorkout = await prisma.workout.update({
            where: { id: id },
            data: {
                name: body.name,
                muscleGroupId: body.muscleGroupId,
                description: body.description,
                date: new Date(body.date),
                totalReps: totalReps,
                totalWeight: totalWeight,
                totalSets: totalSets,
                exerciseWorkouts: {
                    deleteMany: {}, // Delete existing exercise workouts
                    create: exercises.map((exercise: any) => ({
                        id:uuidv4(),
                        exerciseId: exercise.exerciseId,                        
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
                                id:uuidv4(),
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

        return NextResponse.json({
            id: updatedWorkout.id,
            name: updatedWorkout.name,
            muscleGroupId: updatedWorkout.muscleGroupId,
            description: updatedWorkout.description,
            date: updatedWorkout.date
        });
    } catch (error) {
        console.error('Error updating workout:', error);
        return NextResponse.json(
            { message: 'Failed to update workout' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = params;

        // Validate GUID format
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: 'Invalid GUID format' }, { status: 400 });
        }

        await prisma.workout.delete({
            where: {
                id: id
            }
        });
        return NextResponse.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Error deleting workout:', error);
        return NextResponse.json(
            { message: 'Failed to delete workout' },
            { status: 500 }
        );
    }
}