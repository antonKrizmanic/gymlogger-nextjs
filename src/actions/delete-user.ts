'use server';

import { getLoggedInUser } from '@/src/data/loggedInUser';
import { signOut } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

/**
 * Delete a user account and all associated data
 * This is a destructive operation and cannot be undone
 */
export const deleteUser = async (email: string) => {
    try {
        // Get the current user
        const user = await getLoggedInUser();

        if (!user) {
            return { error: 'User not found' };
        }

        if (user.email !== email) {
            return { error: "Email doesn't match" };
        }

        await prisma.workout.deleteMany({
            where: { belongsToUserId: user.id },
        });

        await prisma.exercise.deleteMany({
            where: { belongsToUserId: user.id },
        });

        // Delete the user from the database
        // This will cascade delete all related data due to the foreign key constraints
        await prisma.user.delete({
            where: { id: user.id },
        });

        // Sign the user out
        await signOut({ redirectTo: '/' });

        return { success: true };
    } catch (error) {
        console.error('Error deleting user account:', error);
        return { error: 'Failed to delete user account' };
    }
};
