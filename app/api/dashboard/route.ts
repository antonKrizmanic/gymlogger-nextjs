import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/src/lib/auth';

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
  if (typeof data === 'object' && data !== null && data.constructor === Object) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serializeData(value)])
    );
  }
  
  // Return other types as is
  return data;
}

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

    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if there are any workouts
    const workoutsCount = await prisma.workout.count();
    
    if (workoutsCount === 0) {
      return NextResponse.json(null);
    }

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
      workoutsByDate: []
    };

    // Last workout
    const lastWorkout = await prisma.workout.findFirst({
        select: {
            id: true,
            date: true,
            name: true,
            description: true,
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
      orderBy: {
        date: 'desc'
      }      
    });
    
    dashboard.lastWorkout = {
        id: lastWorkout?.id,
        date: lastWorkout?.date,
        name: lastWorkout?.name,
        description: lastWorkout?.description,
        totalSets: lastWorkout?.exerciseWorkouts.reduce((acc, exercise) => acc + exercise.exerciseSets.length, 0) || 0,
        totalReps: lastWorkout?.exerciseWorkouts.reduce((acc, exercise) => acc + exercise.exerciseSets.reduce((acc, set) => acc + Number(set.reps), 0), 0) || 0,
        totalWeight: lastWorkout?.exerciseWorkouts.reduce((acc, exercise) => acc + exercise.exerciseSets.reduce((acc, set) => acc + (Number(set.reps) * Number(set.weight)), 0), 0) || 0
    };

    // Get favorite muscle group name (max count in workouts)
    const muscleGroupCounts = await prisma.workout.groupBy({
      by: ['muscleGroupId'],
      _count: {
        muscleGroupId: true
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
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Start of year
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    // Workouts this week
    dashboard.workoutsThisWeek = await prisma.workout.count({
      where: {
        date: {
          gte: mondayDate
        }
      }
    });

    // Workouts this month
    dashboard.workoutsThisMonth = await prisma.workout.count({
      where: {
        date: {
          gte: firstDayOfMonth
        }
      }
    });

    // Workouts this year
    dashboard.workoutsThisYear = await prisma.workout.count({
      where: {
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
      SELECT SUM("Weight" * "Reps") as total
      FROM "ExerciseSets"
      JOIN "ExerciseWorkouts" ON "ExerciseSets"."ExerciseWorkoutId" = "ExerciseWorkouts"."Id"
      JOIN "Workouts" ON "ExerciseWorkouts"."WorkoutId" = "Workouts"."Id"
      WHERE "Workouts"."Date" >= ${mondayDate}
    `;
    dashboard.weightThisWeek = weightThisWeek[0]?.total ? Number(weightThisWeek[0].total) : 0;

    // Weight this month
    const weightThisMonth = await prisma.$queryRaw<{ total: Prisma.Decimal }[]>`
      SELECT SUM("Weight" * "Reps") as total
      FROM "ExerciseSets"
      JOIN "ExerciseWorkouts" ON "ExerciseSets"."ExerciseWorkoutId" = "ExerciseWorkouts"."Id"
      JOIN "Workouts" ON "ExerciseWorkouts"."WorkoutId" = "Workouts"."Id"
      WHERE "Workouts"."Date" >= ${firstDayOfMonth}
    `;
    dashboard.weightThisMonth = weightThisMonth[0]?.total ? Number(weightThisMonth[0].total) : 0;

    // Weight this year
    const weightThisYear = await prisma.$queryRaw<{ total: Prisma.Decimal }[]>`
      SELECT SUM("Weight" * "Reps") as total
      FROM "ExerciseSets"
      JOIN "ExerciseWorkouts" ON "ExerciseSets"."ExerciseWorkoutId" = "ExerciseWorkouts"."Id"
      JOIN "Workouts" ON "ExerciseWorkouts"."WorkoutId" = "Workouts"."Id"
      WHERE "Workouts"."Date" >= ${firstDayOfYear}
    `;
    dashboard.weightThisYear = weightThisYear[0]?.total ? Number(weightThisYear[0].total) : 0;

    // WorkoutsByDate (for current month)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const workoutsByDate: DashboardDateItem[] = [];

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
          SUM("Weight" * "Reps") as weight,
          SUM("Reps") as reps,
          COUNT(*) as count
        FROM "ExerciseSets"
        JOIN "ExerciseWorkouts" ON "ExerciseSets"."ExerciseWorkoutId" = "ExerciseWorkouts"."Id"
        JOIN "Workouts" ON "ExerciseWorkouts"."WorkoutId" = "Workouts"."Id"
        WHERE "Workouts"."Date" >= ${currentDate} AND "Workouts"."Date" < ${nextDate}
      `;

      workoutsByDate.push({
        date: currentDate.toISOString().split('T')[0],
        weight: workoutsForDate[0]?.weight ? Number(workoutsForDate[0].weight) : 0,
        series: workoutsForDate[0]?.count || 0,
        reps: workoutsForDate[0]?.reps ? Number(workoutsForDate[0].reps) : 0
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
      { status: 500 }
    );
  }
};