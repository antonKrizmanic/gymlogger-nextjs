import * as z from "zod";
import { ExerciseLogType } from "../Types/Enums";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});

export const ExerciseSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    muscleGroupId: z.string().min(1, { message: "Muscle group must be selected" }),
    exerciseLogType: z.nativeEnum(ExerciseLogType).refine((value) => value !== ExerciseLogType.Unknown, {
      message: "Log type must be selected",
    }),
    description: z.string().optional(),
  })
  
  // Exercise Set Schema
  export const exerciseSetSchema = z.object({
    index: z.number(),
    reps: z.number().optional(),
    weight: z.number().optional(),
    time: z.number().optional(),
    note: z.string().optional(),
  })
  
  export type ExerciseSetSchema = z.infer<typeof exerciseSetSchema>
  
  // Exercise Workout Schema
  export const exerciseWorkoutSchema = z.object({
    exerciseId: z.string().min(1, "Exercise is required"),
    index: z.number(),
    note: z.string().optional(),
    sets: z.array(exerciseSetSchema).min(1, "At least one set is required"),
  })
  
  export type ExerciseWorkoutSchema = z.infer<typeof exerciseWorkoutSchema>
  
  // Workout Schema
  export const workoutSchema = z.object({
    name: z.string().min(1, "Workout name is required"),
    date: z.date({
      required_error: "Date is required",
      invalid_type_error: "Invalid date format",
    }),
    description: z.string().optional(),
    exercises: z.array(exerciseWorkoutSchema).min(1, "At least one exercise is required"),
  })
  
  export type WorkoutSchema = z.infer<typeof workoutSchema>