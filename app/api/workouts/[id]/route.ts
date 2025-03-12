import { NextResponse } from 'next/server';
import { prisma } from "@/src/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        // TODO: Implement single workout retrieval
        return NextResponse.json({ id });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const data = await request.json();
        // TODO: Implement workout update
        return NextResponse.json({ id, message: 'Workout updated' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Provjera valjanosti GUID-a (možeš koristiti regex za dodatnu sigurnost)
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !guidRegex.test(id)) {
            return NextResponse.json({ error: "Invalid GUID format" }, { status: 400 });
        }

        await prisma.workouts.delete({
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