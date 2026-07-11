import {
    calculateExerciseAnalytics,
    calculateWorkoutPersonalRecords,
} from '@/src/lib/performance';
import { prisma } from '@/src/lib/prisma';
import type { IPerformanceSession } from '@/src/models/domain/performance';
import type { ExerciseLogType } from '@/src/types/enums';
import { getLoggedInUser } from './loggedInUser';

type SessionRow = Awaited<ReturnType<typeof loadSessions>>[number];

const loadSessions = (userId: string, exerciseIds: string[]) =>
    prisma.exerciseWorkout.findMany({
        where: {
            belongsToUserId: userId,
            exerciseId: { in: exerciseIds },
        },
        include: {
            exercise: { select: { name: true, exerciseLogType: true } },
            exerciseSets: { orderBy: { index: 'asc' } },
            workout: { select: { id: true, date: true, userWeight: true } },
        },
    });

const mapSession = (row: SessionRow): IPerformanceSession => ({
    exerciseId: row.exerciseId,
    exerciseName: row.exercise.name,
    exerciseLogType: row.exercise.exerciseLogType as ExerciseLogType,
    workoutId: row.workoutId,
    date: row.workout.date,
    userWeight: row.workout.userWeight
        ? Number(row.workout.userWeight)
        : undefined,
    sets: row.exerciseSets.map((set) => ({
        index: set.index,
        weight: set.weight ? Number(set.weight) : undefined,
        reps: set.reps ? Number(set.reps) : undefined,
        time: set.time ? Number(set.time) : undefined,
        note: set.note || undefined,
    })),
});

export async function getWorkoutPersonalRecords(workoutId: string) {
    const user = await getLoggedInUser();
    if (!user) return [];

    const workout = await prisma.workout.findFirst({
        where: { id: workoutId, belongsToUserId: user.id },
        select: {
            date: true,
            exerciseWorkouts: { select: { exerciseId: true } },
        },
    });
    if (!workout) return [];

    const exerciseIds = workout.exerciseWorkouts.map((item) => item.exerciseId);
    const sessions = (await loadSessions(user.id, exerciseIds)).map(mapSession);
    const current = sessions.filter(
        (session) => session.workoutId === workoutId,
    );
    const previous = sessions.filter(
        (session) =>
            session.workoutId !== workoutId && session.date < workout.date,
    );
    return calculateWorkoutPersonalRecords(current, previous);
}

export async function getExerciseAnalytics(exerciseId: string) {
    const user = await getLoggedInUser();
    if (!user) return null;
    const sessions = (await loadSessions(user.id, [exerciseId])).map(
        mapSession,
    );
    return calculateExerciseAnalytics(sessions);
}
