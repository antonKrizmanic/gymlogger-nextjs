'use server';

import type * as z from 'zod';
import { getUserByEmail } from '@/src/data/user';
import { auth } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { ProfileUpdateSchema } from '@/src/schemas';

export const updateProfile = async (
    values: z.infer<typeof ProfileUpdateSchema>,
) => {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: 'Unauthorized' };
    }

    // Get full user data to ensure we have the user ID
    const currentUser = await getUserByEmail(session.user.email);
    if (!currentUser) {
        return { error: 'User not found' };
    }

    const validatedFields = ProfileUpdateSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: 'Invalid fields!' };
    }

    const { weight, height } = validatedFields.data;

    try {
        await prisma.$transaction(async (tx) => {
            // Update user profile
            await tx.user.update({
                where: { id: currentUser.id },
                data: {
                    weight: weight !== undefined ? weight : null,
                    height: height !== undefined ? height : null,
                },
            });

            // Log weight to history if provided
            if (weight !== undefined && !Number.isNaN(weight)) {
                // Optional: avoid duplicate consecutive entries with same value
                const lastEntry = await tx.userWeight.findFirst({
                    where: { userId: currentUser.id },
                    orderBy: { createdAt: 'desc' },
                    select: { weight: true },
                });

                const lastWeightNumber = lastEntry
                    ? Number(lastEntry.weight)
                    : undefined;
                if (
                    lastWeightNumber === undefined ||
                    Math.abs(lastWeightNumber - weight) > 1e-9
                ) {
                    await tx.userWeight.create({
                        data: {
                            userId: currentUser.id,
                            weight: weight,
                        },
                    });
                }
            }
        });

        return { success: 'Profile updated successfully' };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' };
    }
};
