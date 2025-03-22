import { getLoggedInUser } from "@/src/data/loggedInUser";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {

        const exercises = await prisma.exercise.findMany({
            where: {
                OR: [
                    { belongsToUserId: loggedInUser.id },
                    { belongsToUserId: null }
                ]
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(exercises);
    } catch (error) {
        console.error("Failed to fetch exercises:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
