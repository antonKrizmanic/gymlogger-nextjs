import { Decimal } from "@prisma/client/runtime/library";
import { IPagedRequest, IPagedResponse } from "../Types/Common";
import { prisma } from "@/src/lib/prisma";
import { IWorkout, IWorkoutSimple, mapWorkoutToIWorkout } from "../Models/Domain/Workout";
import { SortDirection } from "../Types/Enums";

export interface IWorkoutRequest extends IPagedRequest {
    muscleGroupId: string;
    workoutDate?: Date;
}

export const getWorkout = async(id: string) => {
    const workout = await prisma.workout.findUnique({
        where: {
            id,
        },
    });

    return mapWorkoutToIWorkout(workout);
}

export const getPagedWorkouts = async(pagedRequest:IWorkoutRequest) => {

    const where: any = {};
    if (pagedRequest.muscleGroupId) {
      where.muscleGroupId = pagedRequest.muscleGroupId;
    }

    if (pagedRequest.workoutDate) {
        const startOfDay = new Date(pagedRequest.workoutDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(pagedRequest.workoutDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        where.date = {
            gte: startOfDay,
            lte: endOfDay
        };
    }

    if (pagedRequest.search) {
        where.OR = [
            { name: { contains: pagedRequest.search, mode: 'insensitive' } },
            { description: { contains: pagedRequest.search, mode: 'insensitive' } }
        ];
      }

    
    // Dohvat podataka iz baze
    const totalItems = await prisma.workout.count({ where});

    const workouts = await prisma.workout.findMany({
        where,
        include: {
            muscleGroup: {
                select: {
                    name: true
                }
            },
            exerciseWorkouts: {
                include: {
                    exercise: {
                        select: {
                            name: true
                        }
                    },
                    exerciseSets: true
                }
            }
        },
        orderBy: {
            date: pagedRequest.sortDirection == SortDirection.Ascending ? 'asc' : 'desc'
        },
        skip: pagedRequest.page * pagedRequest.pageSize,
        take: pagedRequest.pageSize
    });

    // Map and calculate totals
    const mappedWorkouts = workouts.map(workout => {        
        const w:IWorkoutSimple = {
            id: workout.id,
            name: workout.name,
            description: workout.description || '',
            date: workout.date,
            muscleGroupId: workout.muscleGroupId,
            muscleGroupName: workout.muscleGroup?.name,
            totalWeight: Number(workout.totalWeight),
            totalReps: Number(workout.totalReps),
            totalSets: Number(workout.totalSets),
        }
        return w;
    });    

    const response: IPagedResponse<IWorkoutSimple> = {
        pagingData: {
            totalItems,
            page: pagedRequest.page,
            pageSize: pagedRequest.pageSize,
            totalPages: Math.ceil(totalItems / pagedRequest.pageSize),
            search: pagedRequest.search,
            sortColumn: pagedRequest.sortColumn,
            sortDirection: pagedRequest.sortDirection,
        },
        items: mappedWorkouts,
    }

    return response;
}


