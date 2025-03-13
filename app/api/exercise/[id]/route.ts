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

        const exercise = await prisma.exercises.findUnique({
            select: {
                Id: true,
                Name: true,
                MuscleGroupId: true,
                Description: true,
                ExerciseLogType: true,
                BelongsToUserId: true,
                MuscleGroups: {
                    select: {
                        Name: true
                    }
                }
            },
            where: {
                Id: id
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
            id: exercise.Id,
            name: exercise.Name,
            muscleGroupId: exercise.MuscleGroupId,
            muscleGroupName: exercise.MuscleGroups.Name,
            description: exercise.Description,
            exerciseLogType: exercise.ExerciseLogType,
            isPublic: exercise.BelongsToUserId === null // If it doesn't belong to a user, it's public
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
        
        const updatedExercise = await prisma.exercises.update({
            where: {
                Id: params.id
            },
            data: {
                Name: body.name,
                MuscleGroupId: body.muscleGroupId,
                Description: body.description,
                ExerciseLogType: body.exerciseLogType,
                UpdatedAt: new Date()
            }
        });
        
        return NextResponse.json({
            id: updatedExercise.Id,
            name: updatedExercise.Name,
            muscleGroupId: updatedExercise.MuscleGroupId,
            description: updatedExercise.Description,
            exerciseLogType: updatedExercise.ExerciseLogType,
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

        await prisma.exercises.delete({
            where: {
                Id: id
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