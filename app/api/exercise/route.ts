import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getPagedExercises, IExerciseRequest } from "@/src/data/exercise";
import { SortDirection } from "@/src/types/enums";
import { getLoggedInUser } from "@/src/data/loggedInUser";


export async function POST(request: NextRequest) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();

    const updatedExercise = await prisma.exercise.create({
      data: {
        name: body.name,
        muscleGroupId: body.muscleGroupId,
        description: body.description,
        exerciseLogType: body.exerciseLogType,
        createdAt: new Date(),
        updatedAt: new Date(),
        belongsToUserId: loggedInUser.id,
      }
    });

    return NextResponse.json({
      id: updatedExercise.id,
      name: updatedExercise.name,
      muscleGroupId: updatedExercise.muscleGroupId,
      description: updatedExercise.description,
      exerciseLogType: updatedExercise.exerciseLogType,
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

  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);

    // Dohvaćanje parametara iz query stringa
    const page = Number(searchParams.get("page")) || 0;
    const pageSize = Number(searchParams.get("size")) || 12;
    const search = searchParams.get("search") || "";
    const muscleGroup = searchParams.get("muscleGroupId") || "";
    const logType = Number(searchParams.get("logType")) || 0;

    const result = await getPagedExercises({
      page,
      pageSize,
      search,
      muscleGroupId: muscleGroup,
      exerciseLogType: logType,
      sortColumn: "name",
      sortDirection: SortDirection.Ascending,
    } as unknown as IExerciseRequest);

    if(result)
    {
      return NextResponse.json({
        items: result.items,
        pagingData: result.pagingData,
      });
    }
    else
    {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
