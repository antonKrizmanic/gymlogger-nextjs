import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})