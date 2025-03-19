"use server";
import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/src/lib/auth";
import { LoginSchema } from "@/src/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/src/routes";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });

    } catch(e) {
        console.error("Failed to sign in!");
        if(e instanceof AuthError) {
            switch(e.type) {
                case "CredentialsSignin": {
                    return { error: "Invalid username or password" };
                }
                default: {
                    return { error: "An error occurred" };
                }
            }
        }
        throw e;
    }

    //return {success: "Yay!"};
}