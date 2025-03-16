import { IExercise, mapExerciseToIExercise } from "../Models/Domain/Exercise";
import { IPagedRequest, IPagedResponse } from "../Types/Common";
import { prisma } from "@/src/lib/prisma";
import { ExerciseLogType } from "../Types/Enums";

export interface IExerciseRequest extends IPagedRequest {
    muscleGroupId?: string;
    exerciseLogType?: ExerciseLogType;
    search?: string;
}

export const getExercise = async(id: string) => {
    const exercise = await prisma.exercise.findUnique({
        where: {
            id,
        },
    });

    return mapExerciseToIExercise(exercise);
};

export const getPagedExercises = async(pagedRequest:IExerciseRequest) => {

    const where: any = {};
    if (pagedRequest.search) {
      where.name = { contains: pagedRequest.search, mode: "insensitive" };
    }

    if (pagedRequest.muscleGroupId) {
      where.muscleGroupId = pagedRequest.muscleGroupId;
    }

    if (pagedRequest.exerciseLogType) {
      where.exerciseLogType = pagedRequest.exerciseLogType;
    }

    const exercises = await prisma.exercise.findMany({
      where,
      skip: (pagedRequest.page) * pagedRequest.pageSize,
      take: pagedRequest.pageSize,
      orderBy: { name: "asc" },
    })

    // Dohvat podataka iz baze
    const totalItems = await prisma.exercise.count({ where});

    const mappedExercises = exercises.map((exercise) => mapExerciseToIExercise(exercise));

    const response: IPagedResponse<IExercise> = {
        pagingData: {
            totalItems,
            page: pagedRequest.page,
            pageSize: pagedRequest.pageSize,
            totalPages: Math.ceil(totalItems / pagedRequest.pageSize),
            search: pagedRequest.search,
            sortColumn: pagedRequest.sortColumn,
            sortDirection: pagedRequest.sortDirection,
        },
        items: mappedExercises,
    }

    return response;
};