import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getLoggedInUser } from "@/src/data/loggedInUser";
import { getExercise } from "@/src/data/exercise";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = params;

        const exercise = await getExercise(id);
        
        if (!exercise) {
            return NextResponse.json(
                { message: 'Exercise not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(exercise);
    } catch (error) {
        console.error('Error fetching exercise:', error);
        return NextResponse.json(
            { message: 'Failed to fetch exercise' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        
        const updatedExercise = await prisma.exercise.update({
            where: {
                id: params.id
            },
            data: {
                name: body.name,
                muscleGroupId: body.muscleGroupId,
                description: body.description,
                exerciseLogType: body.exerciseLogType,
                updatedAt: new Date()
            }
        });
        
        return NextResponse.json({
            id: updatedExercise.id,
            name: updatedExercise.name,
            muscleGroupId: updatedExercise.muscleGroupId,
            description: updatedExercise.description,
            exerciseLogType: updatedExercise.exerciseLogType,
        });
    } catch (error) {
        console.error('Error updating exercise:', error);
        return NextResponse.json(
            { message: 'Failed to update exercise' },
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

        // Provjera valjanosti GUID-a (možeš koristiti regex za dodatnu sigurnost)
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: "Invalid GUID format" }, { status: 400 });
        }

        await prisma.exercise.delete({
            where: {
                id: id
            }
        });
        return NextResponse.json({ message: "Exercise deleted successfully" });
    } catch (error) {
        console.error('Error deleting exercise:', error);
        return NextResponse.json(
            { message: 'Failed to delete exercise' },
            { status: 500 }
        );
    }
}