'use server';
import { prisma } from '@/src/lib/prisma';
import { getUserByEmail } from '../data/user';
import { getVerificationTokenByToken } from '../data/verification-token';

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: 'Invalid token' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: 'Token expired' };
    }

    const user = await getUserByEmail(existingToken.email);
    if (!user) {
        return { error: 'Invalid token' };
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        },
    });

    await prisma.verificationToken.delete({
        where: { id: existingToken.id },
    });

    return { success: 'Email verified!' };
};
