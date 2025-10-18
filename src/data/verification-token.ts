import { v4 } from 'uuid';
import { prisma } from '../lib/prisma';

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                email,
            },
        });

        return verificationToken;
    } catch {
        return null;
    }
};

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token,
            },
        });

        return verificationToken;
    } catch {
        return null;
    }
};

export const generateVerificationToken = async (email: string) => {
    const token = v4();
    const expires = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hour expiration time

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
};
