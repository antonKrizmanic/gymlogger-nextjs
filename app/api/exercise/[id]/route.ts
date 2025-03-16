import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const { id } = params;

        // Provjera valjanosti GUID-a (možeš koristiti regex za dodatnu sigurnost)
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: "Invalid GUID format" }, { status: 400 });
        }

        const exercise = await prisma.exercise.findUnique({
            select: {
                id: true,
                name: true,
                muscleGroupId: true,
                description: true,
                exerciseLogType: true,
                belongsToUserId: true,
                muscleGroup: {
                    select: {
                        name: true
                    }
                }
            },
            where: {
                id: id
            }
        });
        
        if (!exercise) {
            return NextResponse.json(
                { message: 'Exercise not found' },
                { status: 404 }
            );
        }
        console.log('Exercise:', exercise);
        // Map from DB schema to our interface
        return NextResponse.json({
            id: exercise.id,
            name: exercise.name,
            muscleGroupId: exercise.muscleGroupId,
            muscleGroupName: exercise.muscleGroup.name,
            description: exercise.description,
            exerciseLogType: exercise.exerciseLogType,
            isPublic: exercise.belongsToUserId === null // If it doesn't belong to a user, it's public
        });
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