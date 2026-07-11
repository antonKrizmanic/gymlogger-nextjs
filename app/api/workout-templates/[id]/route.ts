import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { getWorkoutTemplate } from '@/src/data/workout-template';
import { prisma } from '@/src/lib/prisma';
import { mapWorkoutTemplateToIWorkoutTemplate } from '@/src/models/domain/workout-template';
import { workoutTemplateSchema } from '@/src/schemas';

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
        const parsed = workoutTemplateSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: 'Invalid workout template',
                    details: parsed.error.issues,
                },
                { status: 400 },
            );
        }

        const data = parsed.data;

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

        const exerciseIds = [
            ...new Set(data.exercises.map((e) => e.exerciseId)),
        ];
        const accessibleExerciseCount = await prisma.exercise.count({
            where: {
                id: { in: exerciseIds },
                OR: [
                    { belongsToUserId: loggedInUser.id },
                    { belongsToUserId: null },
                ],
            },
        });

        if (accessibleExerciseCount !== exerciseIds.length) {
            return NextResponse.json(
                { error: 'One or more exercises are unavailable' },
                { status: 400 },
            );
        }

        // Nested deletion and creation are committed atomically with the update.
        const template = await prisma.workoutTemplate.update({
            where: { id, belongsToUserId: loggedInUser.id },
            data: {
                name: data.name,
                updatedAt: new Date(),
                workoutTemplateExercises: {
                    deleteMany: {},
                    create: data.exercises.map((exercise) => ({
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
                    orderBy: { index: 'asc' },
                },
            },
        });

        return NextResponse.json(
            mapWorkoutTemplateToIWorkoutTemplate(template),
        );
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
            where: { id, belongsToUserId: loggedInUser.id },
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
