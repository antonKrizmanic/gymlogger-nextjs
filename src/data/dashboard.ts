import { Prisma } from "@prisma/client";
import { auth } from "../lib/auth"
import { prisma } from "../lib/prisma";
import { IDashboard, IDashboardDateItem } from "../Models/Domain/Dashboard";
import { getLoggedInUser } from "./loggedInUser";

export const getDashboard = async () => {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return null;

    // Check if there are any workouts
    const workoutsCount = await prisma.workout.count({
        where: {
            belongsToUserId: loggedInUser.id
        }
    });

    if (workoutsCount === 0) {
        return null;
    }

    const dashboard: IDashboard = {
        lastWorkout: undefined,
        favoriteMuscleGroupName: undefined,
        workoutsCount: 0,
        workoutsThisWeek: 0,
        workoutsThisMonth: 0,
        workoutsThisYear: 0,
        seriesThisWeek: 0,
        seriesThisMonth: 0,
        seriesThisYear: 0,
        weightThisWeek: 0,
        weightThisMonth: 0,
        weightThisYear: 0,
        workoutsByDate: []
    };

    // Last workout
    const lastWorkout = await prisma.workout.findFirst({
        select: {
            id: true,
            date: true,
            name: true,
            description: true,
            muscleGroupId: true,
            muscleGroup: {
                select: {
                    name: true
                }
            },
            exerciseWorkouts: {
                select: {
                    exerciseSets: {
                        select: {
                            reps: true,
                            weight: true
                        }
                    }
                }
            }
        },
        where: {
            belongsToUserId: loggedInUser.id
        },
        orderBy: {
            date: 'desc'
        }
    });

    if (lastWorkout) {
        dashboard.lastWorkout = {
            id: lastWorkout.id,
            date: lastWorkout.date,
            name: lastWorkout.name,
            description: lastWorkout.description || undefined,
            muscleGroupId: lastWorkout.muscleGroupId,
            muscleGroupName: lastWorkout.muscleGroup?.name || undefined,
            totalSets: lastWorkout.exerciseWorkouts.reduce((acc, exercise) => acc + exercise.exerciseSets.length, 0) || 0,
            totalReps: lastWorkout.exerciseWorkouts.reduce((acc, exercise) => acc + exercise.exerciseSets.reduce((acc, set) => acc + Number(set.reps), 0), 0) || 0,
            totalWeight: lastWorkout.exerciseWorkouts.reduce((acc, exercise) => acc + exercise.exerciseSets.reduce((acc, set) => acc + (Number(set.reps) * Number(set.weight)), 0), 0) || 0
        };
    }

    // Get favorite muscle group name (max count in workouts)
    const muscleGroupCounts = await prisma.workout.groupBy({
        by: ['muscleGroupId'],
        _count: {
            muscleGroupId: true
        },
        where: {
            belongsToUserId: loggedInUser.id
        },
        orderBy: {
            _count: {
                muscleGroupId: 'desc'
            }
        }
    });

    if (muscleGroupCounts.length > 0) {
        const favoriteMuscleGroupId = muscleGroupCounts[0].muscleGroupId;
        const muscleGroup = await prisma.muscleGroup.findUnique({
            select: {
                name: true
            },
            where: {
                id: favoriteMuscleGroupId
            }
        });
        dashboard.favoriteMuscleGroupName = muscleGroup?.name || undefined;
    }

    // Workouts count
    dashboard.workoutsCount = workoutsCount;

    // Date calculations
    const today = new Date();

    // Calculate start of week (Monday)
    const dayOfWeek = today.getDay();
    const daysUntilMonday = (dayOfWeek + 6) % 7; // Adjust for Monday start (Sunday is 0)
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() - daysUntilMonday);
    mondayDate.setHours(0, 0, 0, 0);

    // Start of month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Start of year
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    // Workouts this week
    dashboard.workoutsThisWeek = await prisma.workout.count({
        where: {
            belongsToUserId: loggedInUser.id,
            date: {
                gte: mondayDate
            }
        }
    });

    // Workouts this month
    dashboard.workoutsThisMonth = await prisma.workout.count({
        where: {
            belongsToUserId: loggedInUser.id,
            date: {
                gte: firstDayOfMonth
            }
        }
    });

    // Workouts this year
    dashboard.workoutsThisYear = await prisma.workout.count({
        where: {
            belongsToUserId: loggedInUser.id,
            date: {
                gte: firstDayOfYear
            }
        }
    });

    // Series this week
    const seriesThisWeek = await prisma.exerciseWorkout.aggregate({
        _sum: {
            totalSets: true
        },
        where: {
            workout: {
                belongsToUserId: loggedInUser.id,
                date: {
                    gte: mondayDate
                }
            }
        }
    });
    dashboard.seriesThisWeek = seriesThisWeek._sum.totalSets ? Number(seriesThisWeek._sum.totalSets) : 0;

    // Series this month
    const seriesThisMonth = await prisma.exerciseWorkout.aggregate({
        _sum: {
            totalSets: true
        },
        where: {
            workout: {
                belongsToUserId: loggedInUser.id,
                date: {
                    gte: firstDayOfMonth
                }
            }
        }
    });
    dashboard.seriesThisMonth = seriesThisMonth._sum.totalSets ? Number(seriesThisMonth._sum.totalSets) : 0;

    // Series this year
    const seriesThisYear = await prisma.exerciseWorkout.aggregate({
        _sum: {
            totalSets: true
        },
        where: {
            workout: {
                belongsToUserId: loggedInUser.id,
                date: {
                    gte: firstDayOfYear
                }
            }
        }
    });
    dashboard.seriesThisYear = seriesThisYear._sum.totalSets ? Number(seriesThisYear._sum.totalSets) : 0;

    // Weight calculations
    // Weight this week
    const weightThisWeek = await prisma.$queryRaw<{ total: Prisma.Decimal }[]>`
      SELECT SUM("weight" * "reps") as total
      FROM "ExerciseSet"
      JOIN "ExerciseWorkout" ON "ExerciseSet"."exerciseWorkoutId" = "ExerciseWorkout"."id"
      JOIN "Workout" ON "ExerciseWorkout"."workoutId" = "Workout"."id"
      WHERE "Workout"."date" >= ${mondayDate}
      AND "Workout"."belongsToUserId" = ${loggedInUser.id}
    `;
    dashboard.weightThisWeek = weightThisWeek[0]?.total ? Number(weightThisWeek[0].total) : 0;

    // Weight this month
    const weightThisMonth = await prisma.$queryRaw<{ total: Prisma.Decimal }[]>`
      SELECT SUM("weight" * "reps") as total
      FROM "ExerciseSet"
      JOIN "ExerciseWorkout" ON "ExerciseSet"."exerciseWorkoutId" = "ExerciseWorkout"."id"
      JOIN "Workout" ON "ExerciseWorkout"."workoutId" = "Workout"."id"
      WHERE "Workout"."date" >= ${firstDayOfMonth}
      AND "Workout"."belongsToUserId" = ${loggedInUser.id}
    `;
    dashboard.weightThisMonth = weightThisMonth[0]?.total ? Number(weightThisMonth[0].total) : 0;

    // Weight this year
    const weightThisYear = await prisma.$queryRaw<{ total: Prisma.Decimal }[]>`
      SELECT SUM("weight" * "reps") as total
      FROM "ExerciseSet"
      JOIN "ExerciseWorkout" ON "ExerciseSet"."exerciseWorkoutId" = "ExerciseWorkout"."id"
      JOIN "Workout" ON "ExerciseWorkout"."workoutId" = "Workout"."id"
      WHERE "Workout"."date" >= ${firstDayOfYear}
        AND "Workout"."belongsToUserId" = ${loggedInUser.id}
    `;
    dashboard.weightThisYear = weightThisYear[0]?.total ? Number(weightThisYear[0].total) : 0;

    // WorkoutsByDate (for current month)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const workoutsByDate: IDashboardDateItem[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(today.getFullYear(), today.getMonth(), i);
        const nextDate = new Date(today.getFullYear(), today.getMonth(), i + 1);

        // Get all exercise sets for workouts on this date
        const workoutsForDate = await prisma.$queryRaw<{
            weight: Prisma.Decimal | null,
            reps: Prisma.Decimal | null,
            count: number
        }[]>`
        SELECT 
          SUM("weight" * "reps") as weight,
          SUM("reps") as reps,
          COUNT(*) as count
        FROM "ExerciseSet"
        JOIN "ExerciseWorkout" ON "ExerciseSet"."exerciseWorkoutId" = "ExerciseWorkout"."id"
        JOIN "Workout" ON "ExerciseWorkout"."workoutId" = "Workout"."id"
        WHERE "Workout"."date" >= ${currentDate} AND "Workout"."date" < ${nextDate}
        AND "Workout"."belongsToUserId" = ${loggedInUser.id}
      `;

        workoutsByDate.push({
            date: currentDate.toISOString().split('T')[0],
            weight: workoutsForDate[0]?.weight ? Number(workoutsForDate[0].weight) : 0,
            series: workoutsForDate[0]?.count || 0,
            reps: workoutsForDate[0]?.reps ? Number(workoutsForDate[0].reps) : 0
        });
    }

    dashboard.workoutsByDate = workoutsByDate;

    return dashboard;
}