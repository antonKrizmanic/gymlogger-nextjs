"use server";

import { getUserByEmail } from "@/src/data/user";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { ProfileUpdateSchema } from "@/src/schemas";
import * as z from "zod";

export const updateProfile = async (values: z.infer<typeof ProfileUpdateSchema>) => {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    // Get full user data to ensure we have the user ID
    const currentUser = await getUserByEmail(session.user.email);
    if (!currentUser) {
        return { error: "User not found" };
    }

    const validatedFields = ProfileUpdateSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid fields!" };
    }

    const { weight, height } = validatedFields.data;

    try {
        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                weight: weight !== undefined ? weight : null,
                height: height !== undefined ? height : null,
            },
        });

        return { success: "Profile updated successfully" };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }
};
