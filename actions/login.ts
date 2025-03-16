"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async(values: z.infer<typeof LoginSchema>) => {
    console.log(values, 'test');
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        console.error(validatedFields.error);
        return { error: "Invalid fields!"};
    }


    return {success: "Yay!"};
}