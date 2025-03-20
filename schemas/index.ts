import { ExerciseLogType } from "@/src/Types/Enums";
import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    
})

export const ExerciseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  muscleGroupId: z.string().min(1, { message: "Muscle group must be selected" }),
  exerciseLogType: z.nativeEnum(ExerciseLogType).refine((value) => value !== ExerciseLogType.Unknown, {
    message: "Log type must be selected",
  }),
  description: z.string().optional(),
})