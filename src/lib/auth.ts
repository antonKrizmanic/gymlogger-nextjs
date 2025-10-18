import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { getUserById } from '@/src/data/user';
import { prisma } from '@/src/lib/prisma';
import authConfig from './auth.config';

export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') {
                return true;
            }
            const existingUser = await getUserById(user.id as string);
            if (!existingUser?.emailVerified) {
                return false;
            }
            return true;
        },
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    ...authConfig,
});
