import { IExercise, mapExerciseToIExercise } from "../models/domain/exercise";
import { IPagedRequest, IPagedResponse } from "../types/common";
import { prisma } from "@/src/lib/prisma";
import { ExerciseLogType } from "../types/enums";
import { auth } from "../lib/auth";
import { getLoggedInUser } from "./loggedInUser";

export interface IExerciseRequest extends IPagedRequest {
  muscleGroupId?: string;
  exerciseLogType?: ExerciseLogType;
  search?: string;
}

export const getExercise = async (id: string): Promise<IExercise | null> => {
  const session = await auth();
  if (!session) return null;

  const exercise = await prisma.exercise.findUnique({
    where: {
      id,
    },
    include: {
      muscleGroup: true,
    },
  });

  return mapExerciseToIExercise(exercise);
};

export const getPagedExercises = async (pagedRequest: IExerciseRequest) => {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) return null;
  
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

  where.OR = [
    { belongsToUserId: loggedInUser.id },
    { belongsToUserId: null }
]

  const exercises = await prisma.exercise.findMany({
    where,
    include: {
      muscleGroup: true,
    },
    skip: (pagedRequest.page) * pagedRequest.pageSize,
    take: pagedRequest.pageSize,
    orderBy: { name: "asc" },
  })

  // Dohvat podataka iz baze
  const totalItems = await prisma.exercise.count({ where });

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