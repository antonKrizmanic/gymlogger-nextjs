'use server';
import { AuthError } from 'next-auth';
import type * as z from 'zod';
import { signIn } from '@/src/lib/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/src/routes';
import { LoginSchema } from '@/src/schemas';
import { getUserByEmail } from '../data/user';
import { generateVerificationToken } from '../data/verification-token';
import { sendVerificationEmail } from '../lib/mail';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: 'Invalid fields!' };
    }

    const { email, password } = validatedFields.data;

    const user = await getUserByEmail(email);

    if (!user || !user.email || !user.password) {
        return { error: 'Invalid username or password' };
    }

    if (!user.emailVerified) {
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );
        return { success: 'Confirmation email sent!' };
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (e) {
        console.error('Failed to sign in!');
        if (e instanceof AuthError) {
            switch (e.type) {
                case 'CredentialsSignin': {
                    return { error: 'Invalid username or password' };
                }
                default: {
                    return { error: 'An error occurred' };
                }
            }
        }
        throw e;
    }

    //return {success: "Yay!"};
};
