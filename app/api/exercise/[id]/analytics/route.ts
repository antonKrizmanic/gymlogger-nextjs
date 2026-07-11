import { NextResponse } from 'next/server';
import { getExerciseAnalytics } from '@/src/data/performance';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const analytics = await getExerciseAnalytics(id);
    if (!analytics) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(analytics);
}
