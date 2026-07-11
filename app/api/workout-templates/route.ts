import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { getPagedWorkoutTemplates } from '@/src/data/workout-template';
import { prisma } from '@/src/lib/prisma';
import { mapWorkoutTemplateToIWorkoutTemplate } from '@/src/models/domain/workout-template';
import { workoutTemplateSchema } from '@/src/schemas';
import { SortDirection } from '@/src/types/enums';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 100;

const getPositiveInteger = (
    value: string | null,
    fallback: number,
    maximum?: number,
) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) return fallback;
    return maximum ? Math.min(parsed, maximum) : parsed;
};

export async function GET(request: NextRequest) {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );

        const { searchParams } = request.nextUrl;
        const page = getPositiveInteger(searchParams.get('page'), 0);
        const pageSize = getPositiveInteger(
            searchParams.get('pageSize'),
            DEFAULT_PAGE_SIZE,
            MAX_PAGE_SIZE,
        );

        const result = await getPagedWorkoutTemplates({
            page,
            pageSize: Math.max(1, pageSize),
            sortColumn: 'createdAt',
            sortDirection: SortDirection.Descending,
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

        // Create workout template
        const template = await prisma.workoutTemplate.create({
            data: {
                id: uuidv4(),
                name: data.name,
                belongsToUserId: loggedInUser.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                workoutTemplateExercises: {
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
            { status: 201 },
        );
    } catch (error) {
        console.error('Error creating workout template:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
