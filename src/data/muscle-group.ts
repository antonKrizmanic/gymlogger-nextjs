import { prisma } from "@/src/lib/prisma";
import { auth } from "../lib/auth";
import { IMuscleGroup } from "../models/domain/muscle-group";

export const getMuscleGroups = async (): Promise<IMuscleGroup[] | null> => {
    const session = await auth();
    if (!session) return null;

    try {
        return await prisma.muscleGroup.findMany({
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                name: 'asc'
            }
        });
    } catch (error) {
        console.error("Failed to fetch muscle groups:", error);
        throw error;
    }
}