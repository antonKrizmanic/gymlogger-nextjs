import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { exerciseId: string; workoutId: string } }
) {
    try {
        const { exerciseId, workoutId } = params;
        // TODO: Implement getting latest exercise workout
        return NextResponse.json({ exerciseId, workoutId });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}