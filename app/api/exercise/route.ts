import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { mapExerciseToIExercise } from "@/src/Models/Domain/Exercise";

const prisma = new PrismaClient();

export type DbExercise = Prisma.ExercisesGetPayload<{}>;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const updatedExercise = await prisma.exercises.create({            
            data: {                
                Name: body.name,
                MuscleGroupId: body.muscleGroupId,
                Description: body.description,
                ExerciseLogType: body.exerciseLogType,
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            }
        });
        
        return NextResponse.json({
            id: updatedExercise.Id,
            name: updatedExercise.Name,
            muscleGroupId: updatedExercise.MuscleGroupId,
            description: updatedExercise.Description,
            exerciseLogType: updatedExercise.ExerciseLogType,
        });
    } catch (error) {
        console.error('Error updating exercise:', error);
        return NextResponse.json(
            { message: 'Failed to update exercise' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dohvaćanje parametara iz query stringa
    const page = Number(searchParams.get("page")) || 0;
    const pageSize = Number(searchParams.get("size")) || 12;
    const search = searchParams.get("search") || "";
    const muscleGroup = searchParams.get("muscleGroupId") || "";
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

    const exercises: DbExercise[] = await prisma.exercises.findMany({
      where,
      skip: (page) * pageSize,
      take: pageSize,
      orderBy: { Name: "asc" },
    })

    // Dohvat podataka iz baze
    const totalItems = await prisma.exercises.count({ where });
    ;

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
