"use client"

import type { IExerciseCreate } from "@/src/Models/Domain/Exercise"
import { ExerciseLogType } from "@/src/Types/Enums"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MuscleGroupSelect } from "../Common/MuscleGroupSelect"
import { LogTypeSelect } from "../Common/LogTypeSelect"
import { SaveIcon } from "../Icons"
import { Button } from "../ui/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { ExerciseSchema } from "@/schemas"

interface ExerciseFormProps {
  title: string
  exercise: IExerciseCreate
  isLoading: boolean
  onSubmit: (exercise: IExerciseCreate) => void
  cancelHref: string
}

export function ExerciseForm({ title, exercise, isLoading, onSubmit, cancelHref }: ExerciseFormProps) {
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof ExerciseSchema>>({
    resolver: zodResolver(ExerciseSchema),
    defaultValues: {
      name: exercise.name,
      muscleGroupId: exercise.muscleGroupId,
      exerciseLogType: exercise.exerciseLogType === ExerciseLogType.Unknown 
        ? undefined 
        : exercise.exerciseLogType,
      description: exercise.description || "",
    },
  })

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof ExerciseSchema>) => {
    onSubmit({
      ...exercise,
      ...values,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Muscle Group field */}
            <FormField
              control={form.control}
              name="muscleGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MuscleGroupSelect
                      selectedMuscleGroup={field.value}
                      onMuscleGroupChange={field.onChange}
                      showAllOption={false}
                      showMessageOption={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exercise Log Type field */}
            <FormField
              control={form.control}
              name="exerciseLogType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LogTypeSelect
                      selectedLogType={field.value}
                      onLogTypeChange={field.onChange}
                      required
                      showAllOption={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form buttons */}
            <div className="flex md:flex-row flex-col justify-end gap-4">
              <Button variant="outline" type="button">
                <Link href={cancelHref}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2" /> Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

