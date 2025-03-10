import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { mapExerciseToIExercise } from "@/src/Models/Domain/Exercise";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dohvaćanje parametara iz query stringa
    const page = Number(searchParams.get("page")) || 0;
    const pageSize = Number(searchParams.get("size")) || 12;
    const search = searchParams.get("search") || "";
    const muscleGroup = searchParams.get("muscleGroup") || "";
    const logType = searchParams.get("logType") || "";

    // Kreiranje where uvjeta na temelju filtera
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (search) {
      where.Name = { contains: search, mode: "insensitive" };
    }
    if (muscleGroup) {
      where.MuscleGroupId = muscleGroup;
    }
    if (logType && Number(logType) !== 0) {
      where.ExerciseLogType = Number(logType);
    }

    // Dohvat podataka iz baze
    const [exercises, totalItems] = await Promise.all([
      prisma.exercises.findMany({
        where,
        skip: (page) * pageSize,
        take: pageSize,
        orderBy: { Name: "asc" },
      }),
      prisma.exercises.count({ where }),
    ]);

    const mappedExercises = exercises.map((exercise) => mapExerciseToIExercise(exercise));

    return NextResponse.json({
      items: mappedExercises,
      pagingData: {
        totalItems,
        page,
        pageSize,
        search,        
        totalPages: Math.ceil(totalItems / pageSize),        
      },
    });
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
