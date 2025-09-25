import { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { IDashboard, IDashboardDateItem } from "../models/domain/dashboard";
import { getLoggedInUser } from "./loggedInUser";

interface DateBoundaries {
    today: Date;
    weekStart: Date;
    monthStart: Date;
    nextMonthStart: Date;
    yearStart: Date;
}

type NumericPrimitive = Prisma.Decimal | bigint | number | null | undefined;

export const getDashboard = async (): Promise<IDashboard | null> => {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return null;

    const workoutsCount = await prisma.workout.count({
        where: { belongsToUserId: loggedInUser.id },
    });

    if (workoutsCount === 0) {
        return null;
    }

    const boundaries = getDateBoundaries();

    const [
        lastWorkout,
        favoriteMuscleGroupName,
        workoutCounts,
        seriesTotals,
        weightTotals,
        workoutsByDate,
    ] = await Promise.all([
        loadLastWorkout(loggedInUser.id),
        loadFavoriteMuscleGroupName(loggedInUser.id),
        loadWorkoutCounts(loggedInUser.id, boundaries),
        loadSeriesTotals(loggedInUser.id, boundaries),
        loadWeightTotals(loggedInUser.id, boundaries),
        loadWorkoutsByDate(loggedInUser.id, boundaries),
    ]);

    return {
        lastWorkout,
        favoriteMuscleGroupName,
        workoutsCount,
        ...workoutCounts,
        ...seriesTotals,
        ...weightTotals,
        workoutsByDate,
    };
};

function getDateBoundaries(reference = new Date()): DateBoundaries {
    const today = new Date(reference);
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    const dayOfWeek = weekStart.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7; // Monday start
    weekStart.setDate(weekStart.getDate() - daysSinceMonday);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    return { today, weekStart, monthStart, nextMonthStart, yearStart };
}

async function loadLastWorkout(userId: string): Promise<IDashboard["lastWorkout"]> {
    const workout = await prisma.workout.findFirst({
        select: {
            id: true,
            date: true,
            name: true,
            description: true,
            muscleGroupId: true,
            muscleGroup: {
                select: { name: true },
            },
            exerciseWorkouts: {
                select: {
                    exerciseSets: {
                        select: {
                            reps: true,
                            weight: true,
                        },
                    },
                },
            },
        },
        where: { belongsToUserId: userId },
        orderBy: { date: "desc" },
    });

    if (!workout) {
        return undefined;
    }

    const totals = workout.exerciseWorkouts.reduce(
        (acc, exercise) => {
            const sets = exercise.exerciseSets ?? [];
            acc.totalSets += sets.length;

            for (const set of sets) {
                const reps = toNumber(set.reps);
                const weight = toNumber(set.weight);
                acc.totalReps += reps;
                acc.totalWeight += reps * weight;
            }

            return acc;
        },
        { totalSets: 0, totalReps: 0, totalWeight: 0 },
    );

    return {
        id: workout.id,
        date: workout.date,
        name: workout.name,
        description: workout.description || undefined,
        muscleGroupId: workout.muscleGroupId,
        muscleGroupName: workout.muscleGroup?.name || undefined,
        totalSets: totals.totalSets,
        totalReps: totals.totalReps,
        totalWeight: totals.totalWeight,
    };
}

async function loadFavoriteMuscleGroupName(userId: string): Promise<string | undefined> {
    const [mostFrequent] = await prisma.workout.groupBy({
        by: ["muscleGroupId"],
        _count: { muscleGroupId: true },
        where: { belongsToUserId: userId },
        orderBy: {
            _count: { muscleGroupId: "desc" },
        },
        take: 1,
    });

    if (!mostFrequent?.muscleGroupId) {
        return undefined;
    }

    const muscleGroup = await prisma.muscleGroup.findUnique({
        select: { name: true },
        where: { id: mostFrequent.muscleGroupId },
    });

    return muscleGroup?.name || undefined;
}

async function loadWorkoutCounts(userId: string, boundaries: DateBoundaries) {
    const [row] = await prisma.$queryRaw<Array<{ week_count: NumericPrimitive; month_count: NumericPrimitive; year_count: NumericPrimitive }>>`
    SELECT
      SUM(CASE WHEN "date" >= ${boundaries.weekStart} THEN 1 ELSE 0 END) AS week_count,
      SUM(CASE WHEN "date" >= ${boundaries.monthStart} THEN 1 ELSE 0 END) AS month_count,
      SUM(CASE WHEN "date" >= ${boundaries.yearStart} THEN 1 ELSE 0 END) AS year_count
    FROM "Workout"
    WHERE "belongsToUserId" = ${userId}
      AND "date" >= ${boundaries.yearStart}
  `;

    return {
        workoutsThisWeek: toNumber(row?.week_count),
        workoutsThisMonth: toNumber(row?.month_count),
        workoutsThisYear: toNumber(row?.year_count),
    };
}

async function loadSeriesTotals(userId: string, boundaries: DateBoundaries) {
    const [row] = await prisma.$queryRaw<Array<{
        week_total: NumericPrimitive;
        month_total: NumericPrimitive;
        year_total: NumericPrimitive;
    }>>`
    SELECT
      SUM(CASE WHEN w."date" >= ${boundaries.weekStart} THEN COALESCE(e."totalSets", 0) ELSE 0 END) AS week_total,
      SUM(CASE WHEN w."date" >= ${boundaries.monthStart} THEN COALESCE(e."totalSets", 0) ELSE 0 END) AS month_total,
      SUM(CASE WHEN w."date" >= ${boundaries.yearStart} THEN COALESCE(e."totalSets", 0) ELSE 0 END) AS year_total
    FROM "ExerciseWorkout" e
    JOIN "Workout" w ON w."id" = e."workoutId"
    WHERE w."belongsToUserId" = ${userId}
      AND w."date" >= ${boundaries.yearStart}
  `;

    return {
        seriesThisWeek: toNumber(row?.week_total),
        seriesThisMonth: toNumber(row?.month_total),
        seriesThisYear: toNumber(row?.year_total),
    };
}

async function loadWeightTotals(userId: string, boundaries: DateBoundaries) {
    const [row] = await prisma.$queryRaw<Array<{
        week_total: NumericPrimitive;
        month_total: NumericPrimitive;
        year_total: NumericPrimitive;
    }>>`
    SELECT
      SUM(CASE WHEN w."date" >= ${boundaries.weekStart} THEN COALESCE(s."weight", 0) * COALESCE(s."reps", 0) ELSE 0 END) AS week_total,
      SUM(CASE WHEN w."date" >= ${boundaries.monthStart} THEN COALESCE(s."weight", 0) * COALESCE(s."reps", 0) ELSE 0 END) AS month_total,
      SUM(CASE WHEN w."date" >= ${boundaries.yearStart} THEN COALESCE(s."weight", 0) * COALESCE(s."reps", 0) ELSE 0 END) AS year_total
    FROM "ExerciseSet" s
    JOIN "ExerciseWorkout" e ON e."id" = s."exerciseWorkoutId"
    JOIN "Workout" w ON w."id" = e."workoutId"
    WHERE w."belongsToUserId" = ${userId}
      AND w."date" >= ${boundaries.yearStart}
  `;

    return {
        weightThisWeek: toNumber(row?.week_total),
        weightThisMonth: toNumber(row?.month_total),
        weightThisYear: toNumber(row?.year_total),
    };
}

async function loadWorkoutsByDate(userId: string, boundaries: DateBoundaries): Promise<IDashboardDateItem[]> {
    const rows = await prisma.$queryRaw<Array<{
        date: Date;
        total_weight: NumericPrimitive;
        total_reps: NumericPrimitive;
        total_sets: NumericPrimitive;
    }>>`
    SELECT
      DATE(w."date") AS date,
      SUM(COALESCE(s."weight", 0) * COALESCE(s."reps", 0)) AS total_weight,
      SUM(COALESCE(s."reps", 0)) AS total_reps,
      COUNT(s."id") AS total_sets
    FROM "Workout" w
    LEFT JOIN "ExerciseWorkout" e ON e."workoutId" = w."id"
    LEFT JOIN "ExerciseSet" s ON s."exerciseWorkoutId" = e."id"
    WHERE w."belongsToUserId" = ${userId}
      AND w."date" >= ${boundaries.monthStart}
      AND w."date" < ${boundaries.nextMonthStart}
    GROUP BY DATE(w."date")
    ORDER BY DATE(w."date")
  `;

    const dateMap = new Map<string, { weight: number; reps: number; sets: number }>();

    for (const row of rows) {
        const dateKey = toIsoDate(row.date);
        dateMap.set(dateKey, {
            weight: toNumber(row.total_weight),
            reps: toNumber(row.total_reps),
            sets: toNumber(row.total_sets),
        });
    }

    const days: IDashboardDateItem[] = [];
    const cursor = new Date(boundaries.monthStart);

    while (cursor < boundaries.nextMonthStart) {
        const key = toIsoDate(cursor);
        const metrics = dateMap.get(key);

        days.push({
            date: key,
            weight: metrics?.weight ?? 0,
            reps: metrics?.reps ?? 0,
            series: metrics?.sets ?? 0,
        });

        cursor.setDate(cursor.getDate() + 1);
    }

    return days;
}

function toNumber(value: NumericPrimitive): number {
    if (value === null || value === undefined) {
        return 0;
    }

    if (typeof value === "number") {
        return Number.isNaN(value) ? 0 : value;
    }

    if (typeof value === "bigint") {
        return Number(value);
    }

    return Number(value);
}

function toIsoDate(value: Date): string {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split("T")[0];
}