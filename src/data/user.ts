import { prisma } from '@/src/lib/prisma';

export const getUserByEmail = async (email: string) => {
    try {
        return await prisma.user.findUnique({ where: { email } });
    } catch {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        return await prisma.user.findUnique({ where: { id } });
    } catch {
        return null;
    }
};

export const getUserWeights = async (userId: string, limit: number = 180) => {
    try {
        const items = await prisma.userWeight.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            take: limit,
            select: { id: true, weight: true, createdAt: true },
        });
        return items;
    } catch {
        return [];
    }
};
