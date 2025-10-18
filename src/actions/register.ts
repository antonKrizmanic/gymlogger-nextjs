'use server';
import bcrypt from 'bcryptjs';
import type * as z from 'zod';
import { getUserByEmail } from '@/src/data/user';
import { prisma } from '@/src/lib/prisma';
import { RegisterSchema } from '@/src/schemas';
import { generateVerificationToken } from '../data/verification-token';
import { sendVerificationEmail } from '../lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: 'Invalid fields!' };
    }
    const { name, email, password, confirmPassword } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: 'Email already in use.' };
    }

    if (password !== confirmPassword) {
        return { error: 'The passwords did not match.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );

    return { success: 'Confirmation email sent!' };
};
