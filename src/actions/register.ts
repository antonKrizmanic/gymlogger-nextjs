"use server";
import * as z from "zod";
import { RegisterSchema } from "@/src/schemas";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/src/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid fields!" };
    }
    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already in use." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });

    return { success: "You are now registered." };
}