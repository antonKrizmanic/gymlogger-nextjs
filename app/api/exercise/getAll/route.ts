import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {

        const exercises = await prisma.exercise.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(exercises);
    } catch (error) {
        console.error("Failed to fetch exercises:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
