import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { prisma } from '@/src/lib/prisma';

// Helper function to safely serialize BigInt, Decimal, and Date values
function serializeData(data: any): any {
    // Handle null/undefined
    if (data === null || data === undefined) {
        return data;
    }

    // Handle BigInt
    if (typeof data === 'bigint') {
        return Number(data);
    }

    // Handle Prisma Decimal
    if (data instanceof Prisma.Decimal) {
        return Number(data);
    }

    // Handle Date objects - convert to ISO string
    if (data instanceof Date) {
        return data.toISOString();
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(serializeData);
    }

    // Handle objects (but check if it's a regular object, not a Date or other special type)
    if (
        typeof data === 'object' &&
        data !== null &&
        data.constructor === Object
    ) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                serializeData(value),
            ]),
        );
    }

    // Return other types as is
    return data;
}

// Make sure all numeric calculations in workoutsByDate are safely converted
const safeNumberConversion = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'bigint') return Number(value);
    if (value instanceof Prisma.Decimal) return Number(value);
    return Number(value) || 0;
};

// Define dashboard interface
interface Dashboard {
    lastWorkout: any | null;
    favoriteMuscleGroupName: string | null;
    workoutsCount: number;
    workoutsThisWeek: number;
    workoutsThisMonth: number;
    workoutsThisYear: number;
    seriesThisWeek: number | 0;
    seriesThisMonth: number | 0;
    seriesThisYear: number | 0;
    weightThisWeek: number | null;
    weightThisMonth: number | null;
    weightThisYear: number | null;
    workoutsByDate: DashboardDateItem[];
}

interface DashboardDateItem {
    date: string;
    weight: number | null;
    series: number;
    reps: number | null;
}

export async function GET() {
    try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );

        // Check if there are any workouts
        const workoutsCount = await prisma.workout.count();

        if (workoutsCount === 0) {
            return NextResponse.json(null);
        }

        // Get user's weight for bodyweight calculations
        const userWeight = loggedInUser.weight
            ? Number(loggedInUser.weight)
            : null;

        const dashboard: Dashboard = {
            lastWorkout: null,
            favoriteMuscleGroupName: null,
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
            workoutsByDate: [],
        };

        // Last workout
        const lastWorkout = await prisma.workout.findFirst({
            select: {
                id: true,
                date: true,
                name: true,
                description: true,
                userWeight: true, // Get stored weight at workout time
                exerciseWorkouts: {
                    select: {
                        exercise: {
                            select: {
                                exerciseLogType: true,
                            },
                        },
                        exerciseSets: {
                            select: {
                                reps: true,
                                weight: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });

        // Calculate totals with proper exercise type handling using stored workout weight
        let totalSets = 0;
        let totalReps = 0;
        let totalWeight = 0;

        if (lastWorkout) {
            const workoutWeight = lastWorkout.userWeight
                ? Number(lastWorkout.userWeight)
                : null;
            lastWorkout.exerciseWorkouts.forEach((exercise) => {
                const exerciseLogType = exercise.exercise.exerciseLogType;
                const sets = exercise.exerciseSets;

                totalSets += sets.length;

                sets.forEach((set) => {
                    const reps = Number(set.reps || 0);
                    const setWeight = Number(set.weight || 0);
                    totalReps += reps;

                    // Calculate weight based on exercise log type using stored workout weight
                    if (exerciseLogType === 4) {
                        // BodyWeight
                        // For pure bodyweight exercises, use stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        totalWeight += bodyWeight * reps;
                    } else if (exerciseLogType === 5) {
                        // BodyWeightWithAdditionalWeight
                        // For bodyweight exercises with additional weight, add stored workout weight to the additional weight
                        const bodyWeight = workoutWeight || 0;
                        const additionalWeight = setWeight;
                        totalWeight += (bodyWeight + additionalWeight) * reps;
                    } else if (exerciseLogType === 6) {
                        // BodyWeightWithAssistance
                        // For assisted bodyweight exercises, subtract assistance weight from stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        const assistanceWeight = setWeight;
                        totalWeight += (bodyWeight - assistanceWeight) * reps;
                    } else {
                        // For regular weight exercises
                        totalWeight += setWeight * reps;
                    }
                });
            });
        }

        dashboard.lastWorkout = {
            id: lastWorkout?.id,
            date: lastWorkout?.date,
            name: lastWorkout?.name,
            description: lastWorkout?.description,
            totalSets: totalSets,
            totalReps: totalReps,
            totalWeight: totalWeight,
        };

        // Get favorite muscle group name (max count in workouts)
        const muscleGroupCounts = await prisma.workout.groupBy({
            by: ['muscleGroupId'],
            _count: {
                muscleGroupId: true,
            },
            orderBy: {
                _count: {
                    muscleGroupId: 'desc',
                },
            },
        });

        if (muscleGroupCounts.length > 0) {
            const favoriteMuscleGroupId = muscleGroupCounts[0].muscleGroupId;
            const muscleGroup = await prisma.muscleGroup.findUnique({
                select: {
                    name: true,
                },
                where: {
                    id: favoriteMuscleGroupId,
                },
            });
            dashboard.favoriteMuscleGroupName = muscleGroup?.name || null;
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
        const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
        );

        // Start of year
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

        // Workouts this week
        dashboard.workoutsThisWeek = await prisma.workout.count({
            where: {
                date: {
                    gte: mondayDate,
                },
            },
        });

        // Workouts this month
        dashboard.workoutsThisMonth = await prisma.workout.count({
            where: {
                date: {
                    gte: firstDayOfMonth,
                },
            },
        });

        // Workouts this year
        dashboard.workoutsThisYear = await prisma.workout.count({
            where: {
                date: {
                    gte: firstDayOfYear,
                },
            },
        });

        // Series this week
        const seriesThisWeek = await prisma.exerciseWorkout.aggregate({
            _sum: {
                totalSets: true,
            },
            where: {
                workout: {
                    date: {
                        gte: mondayDate,
                    },
                },
            },
        });
        dashboard.seriesThisWeek = seriesThisWeek._sum.totalSets
            ? Number(seriesThisWeek._sum.totalSets)
            : 0;

        // Series this month
        const seriesThisMonth = await prisma.exerciseWorkout.aggregate({
            _sum: {
                totalSets: true,
            },
            where: {
                workout: {
                    date: {
                        gte: firstDayOfMonth,
                    },
                },
            },
        });
        dashboard.seriesThisMonth = seriesThisMonth._sum.totalSets
            ? Number(seriesThisMonth._sum.totalSets)
            : 0;

        // Series this year
        const seriesThisYear = await prisma.exerciseWorkout.aggregate({
            _sum: {
                totalSets: true,
            },
            where: {
                workout: {
                    date: {
                        gte: firstDayOfYear,
                    },
                },
            },
        });
        dashboard.seriesThisYear = seriesThisYear._sum.totalSets
            ? Number(seriesThisYear._sum.totalSets)
            : 0;

        // Weight calculations with proper exercise type handling using stored workout weights
        const weightThisWeek = await prisma.workout.findMany({
            select: {
                userWeight: true, // Get stored weight at workout time
                exerciseWorkouts: {
                    select: {
                        exercise: {
                            select: {
                                exerciseLogType: true,
                            },
                        },
                        exerciseSets: {
                            select: {
                                reps: true,
                                weight: true,
                            },
                        },
                    },
                },
            },
            where: {
                date: {
                    gte: mondayDate,
                },
            },
        });

        let weekWeightTotal = 0;
        weightThisWeek.forEach((workout) => {
            const workoutWeight = workout.userWeight
                ? Number(workout.userWeight)
                : null;
            workout.exerciseWorkouts.forEach((exercise) => {
                const exerciseLogType = exercise.exercise.exerciseLogType;
                const sets = exercise.exerciseSets;

                sets.forEach((set) => {
                    const reps = Number(set.reps || 0);
                    const setWeight = Number(set.weight || 0);

                    // Calculate weight based on exercise log type using stored workout weight
                    if (exerciseLogType === 4) {
                        // BodyWeight
                        // For pure bodyweight exercises, use stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        weekWeightTotal += bodyWeight * reps;
                    } else if (exerciseLogType === 5) {
                        // BodyWeightWithAdditionalWeight
                        // For bodyweight exercises with additional weight, add stored workout weight to the additional weight
                        const bodyWeight = workoutWeight || 0;
                        const additionalWeight = setWeight;
                        weekWeightTotal +=
                            (bodyWeight + additionalWeight) * reps;
                    } else if (exerciseLogType === 6) {
                        // BodyWeightWithAssistance
                        // For assisted bodyweight exercises, subtract assistance weight from stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        const assistanceWeight = setWeight;
                        weekWeightTotal +=
                            (bodyWeight - assistanceWeight) * reps;
                    } else {
                        // For regular weight exercises
                        weekWeightTotal += setWeight * reps;
                    }
                });
            });
        });
        dashboard.weightThisWeek = weekWeightTotal;

        const weightThisMonth = await prisma.workout.findMany({
            select: {
                userWeight: true, // Get stored weight at workout time
                exerciseWorkouts: {
                    select: {
                        exercise: {
                            select: {
                                exerciseLogType: true,
                            },
                        },
                        exerciseSets: {
                            select: {
                                reps: true,
                                weight: true,
                            },
                        },
                    },
                },
            },
            where: {
                date: {
                    gte: firstDayOfMonth,
                },
            },
        });

        let monthWeightTotal = 0;
        weightThisMonth.forEach((workout) => {
            const workoutWeight = workout.userWeight
                ? Number(workout.userWeight)
                : null;
            workout.exerciseWorkouts.forEach((exercise) => {
                const exerciseLogType = exercise.exercise.exerciseLogType;
                const sets = exercise.exerciseSets;

                sets.forEach((set) => {
                    const reps = Number(set.reps || 0);
                    const setWeight = Number(set.weight || 0);

                    // Calculate weight based on exercise log type using stored workout weight
                    if (exerciseLogType === 4) {
                        // BodyWeight
                        // For pure bodyweight exercises, use stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        monthWeightTotal += bodyWeight * reps;
                    } else if (exerciseLogType === 5) {
                        // BodyWeightWithAdditionalWeight
                        // For bodyweight exercises with additional weight, add stored workout weight to the additional weight
                        const bodyWeight = workoutWeight || 0;
                        const additionalWeight = setWeight;
                        monthWeightTotal +=
                            (bodyWeight + additionalWeight) * reps;
                    } else if (exerciseLogType === 6) {
                        // BodyWeightWithAssistance
                        // For assisted bodyweight exercises, subtract assistance weight from stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        const assistanceWeight = setWeight;
                        monthWeightTotal +=
                            (bodyWeight - assistanceWeight) * reps;
                    } else {
                        // For regular weight exercises
                        monthWeightTotal += setWeight * reps;
                    }
                });
            });
        });
        dashboard.weightThisMonth = monthWeightTotal;

        const weightThisYear = await prisma.workout.findMany({
            select: {
                userWeight: true, // Get stored weight at workout time
                exerciseWorkouts: {
                    select: {
                        exercise: {
                            select: {
                                exerciseLogType: true,
                            },
                        },
                        exerciseSets: {
                            select: {
                                reps: true,
                                weight: true,
                            },
                        },
                    },
                },
            },
            where: {
                date: {
                    gte: firstDayOfYear,
                },
            },
        });

        let yearWeightTotal = 0;
        weightThisYear.forEach((workout) => {
            const workoutWeight = workout.userWeight
                ? Number(workout.userWeight)
                : null;
            workout.exerciseWorkouts.forEach((exercise) => {
                const exerciseLogType = exercise.exercise.exerciseLogType;
                const sets = exercise.exerciseSets;

                sets.forEach((set) => {
                    const reps = Number(set.reps || 0);
                    const setWeight = Number(set.weight || 0);

                    // Calculate weight based on exercise log type using stored workout weight
                    if (exerciseLogType === 4) {
                        // BodyWeight
                        // For pure bodyweight exercises, use stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        yearWeightTotal += bodyWeight * reps;
                    } else if (exerciseLogType === 5) {
                        // BodyWeightWithAdditionalWeight
                        // For bodyweight exercises with additional weight, add stored workout weight to the additional weight
                        const bodyWeight = workoutWeight || 0;
                        const additionalWeight = setWeight;
                        yearWeightTotal +=
                            (bodyWeight + additionalWeight) * reps;
                    } else if (exerciseLogType === 6) {
                        // BodyWeightWithAssistance
                        // For assisted bodyweight exercises, subtract assistance weight from stored workout weight
                        const bodyWeight = workoutWeight || 0;
                        const assistanceWeight = setWeight;
                        yearWeightTotal +=
                            (bodyWeight - assistanceWeight) * reps;
                    } else {
                        // For regular weight exercises
                        yearWeightTotal += setWeight * reps;
                    }
                });
            });
        });
        dashboard.weightThisYear = yearWeightTotal;

        // WorkoutsByDate (for current month) with proper exercise type handling
        const daysInMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
        ).getDate();
        const workoutsByDate: DashboardDateItem[] = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                i,
            );
            const nextDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                i + 1,
            );

            // Get all exercise sets for workouts on this date with exercise log types and stored workout weights
            const workoutsForDate = await prisma.workout.findMany({
                select: {
                    userWeight: true, // Get stored weight at workout time
                    exerciseWorkouts: {
                        select: {
                            exercise: {
                                select: {
                                    exerciseLogType: true,
                                },
                            },
                            exerciseSets: {
                                select: {
                                    reps: true,
                                    weight: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    date: {
                        gte: currentDate,
                        lt: nextDate,
                    },
                },
            });

            let dayWeightTotal = 0;
            let dayRepsTotal = 0;
            let daySetsTotal = 0;

            workoutsForDate.forEach((workout) => {
                const workoutWeight = workout.userWeight
                    ? Number(workout.userWeight)
                    : null;
                workout.exerciseWorkouts.forEach((exercise) => {
                    const exerciseLogType = exercise.exercise.exerciseLogType;
                    const sets = exercise.exerciseSets;

                    sets.forEach((set) => {
                        const reps = Number(set.reps || 0);
                        const setWeight = Number(set.weight || 0);
                        daySetsTotal += 1;
                        dayRepsTotal += reps;

                        // Calculate weight based on exercise log type using stored workout weight
                        if (exerciseLogType === 4) {
                            // BodyWeight
                            // For pure bodyweight exercises, use stored workout weight
                            const bodyWeight = workoutWeight || 0;
                            dayWeightTotal += bodyWeight * reps;
                        } else if (exerciseLogType === 5) {
                            // BodyWeightWithAdditionalWeight
                            // For bodyweight exercises with additional weight, add stored workout weight to the additional weight
                            const bodyWeight = workoutWeight || 0;
                            const additionalWeight = setWeight;
                            dayWeightTotal +=
                                (bodyWeight + additionalWeight) * reps;
                        } else if (exerciseLogType === 6) {
                            // BodyWeightWithAssistance
                            // For assisted bodyweight exercises, subtract assistance weight from stored workout weight
                            const bodyWeight = workoutWeight || 0;
                            const assistanceWeight = setWeight;
                            dayWeightTotal +=
                                (bodyWeight - assistanceWeight) * reps;
                        } else {
                            // For regular weight exercises
                            dayWeightTotal += setWeight * reps;
                        }
                    });
                });
            });

            workoutsByDate.push({
                date: currentDate.toISOString().split('T')[0],
                weight: dayWeightTotal,
                series: daySetsTotal,
                reps: dayRepsTotal,
            });
        }

        dashboard.workoutsByDate = workoutsByDate;

        // Serialize the dashboard data to handle BigInt, Decimal, and Date values
        const serializedDashboard = serializeData(dashboard);
        return NextResponse.json(serializedDashboard);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 },
        );
    }
}
