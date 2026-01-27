import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { getPagedWorkoutTemplates } from '@/src/data/workout-template';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );

        const { searchParams } = request.nextUrl;
        const page = Number(searchParams.get('page')) || 0;
        const pageSize = Number(searchParams.get('pageSize')) || 12;
        const search = searchParams.get('search') || '';

        const result = await getPagedWorkoutTemplates({
            page,
            pageSize,
            search,
        });

        if (result) {
            return NextResponse.json({
                items: result.items,
                pagingData: result.pagingData,
            });
        } else {
            return NextResponse.json(
                { error: 'Internal Server Error' },
                { status: 500 },
            );
        }
    } catch (error) {
        console.error('Error fetching workout templates:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );

        const data = await request.json();

        // Validate data structure
        interface ExerciseData {
            exerciseId: string;
            sets: number;
            reps: number;
            index: number;
        }

        // Create workout template
        const template = await prisma.workoutTemplate.create({
            data: {
                id: uuidv4(),
                name: data.name,
                belongsToUserId: loggedInUser.id,
                createdAt: new Date(),
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
            message: 'Workout template created',
            template,
        });
    } catch (error) {
        console.error('Error creating workout template:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
