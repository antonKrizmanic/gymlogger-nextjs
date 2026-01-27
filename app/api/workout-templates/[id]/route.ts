import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { getWorkoutTemplate } from '@/src/data/workout-template';
import { prisma } from '@/src/lib/prisma';
import { mapWorkoutTemplateToIWorkoutTemplate } from '@/src/models/domain/workout-template';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );

        const { id } = await params;
        const template = await getWorkoutTemplate(id);

        if (!template) {
            return NextResponse.json(
                { error: 'Workout template not found' },
                { status: 404 },
            );
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error('Error fetching workout template:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );

        const { id } = await params;
        const data = await request.json();

        // Check if template exists and belongs to user
        const existingTemplate = await prisma.workoutTemplate.findFirst({
            where: {
                id,
                belongsToUserId: loggedInUser.id,
            },
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { error: 'Workout template not found' },
                { status: 404 },
            );
        }

        // Delete existing exercises and create new ones
        await prisma.workoutTemplateExercise.deleteMany({
            where: {
                workoutTemplateId: id,
            },
        });

        // Validate data structure
        interface ExerciseData {
            exerciseId: string;
            sets: number;
            reps: number;
            index: number;
        }

        // Update template
        const template = await prisma.workoutTemplate.update({
            where: { id },
            data: {
                name: data.name,
                updatedAt: new Date(),
                workoutTemplateExercises: {
                    create: data.exercises?.map((exercise: ExerciseData) => ({
                        id: uuidv4(),
                        exerciseId: exercise.exerciseId,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        index: exercise.index,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })),
                },
            },
            include: {
                workoutTemplateExercises: {
                    include: {
                        exercise: true,
                    },
                },
            },
        });

        return NextResponse.json({
            message: 'Workout template updated',
            template: mapWorkoutTemplateToIWorkoutTemplate(template),
        });
    } catch (error) {
        console.error('Error updating workout template:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );

        const { id } = await params;

        // Check if template exists and belongs to user
        const existingTemplate = await prisma.workoutTemplate.findFirst({
            where: {
                id,
                belongsToUserId: loggedInUser.id,
            },
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { error: 'Workout template not found' },
                { status: 404 },
            );
        }

        // Delete template (cascade will delete exercises)
        await prisma.workoutTemplate.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Workout template deleted' });
    } catch (error) {
        console.error('Error deleting workout template:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
