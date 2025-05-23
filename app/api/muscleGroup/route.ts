import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { getMuscleGroups } from "@/src/data/muscle-group";

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    try {        
        const muscleGroups = await getMuscleGroups();

        return NextResponse.json(muscleGroups, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch muscle groups:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}