import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DbMuscleGroup, mapMuscleGroupToIMuscleGroup } from "@/src/Models/Domain/MuscleGroup";
import { auth } from "@/src/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    try {        
        const muscleGroup:DbMuscleGroup[] = await prisma.muscleGroup.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                name: 'asc'
            }
        });

        const mappedMuscleGroups = muscleGroup.map((muscleGroup: DbMuscleGroup) => mapMuscleGroupToIMuscleGroup(muscleGroup));

        return NextResponse.json(mappedMuscleGroups);

    } catch (error) {
        console.error("Failed to fetch muscle groups:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}