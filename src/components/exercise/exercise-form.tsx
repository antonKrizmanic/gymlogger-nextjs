'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, StickyNote, Target } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/src/components/ui/form';
import { IconInput, IconTextarea } from '@/src/components/ui/icon-input';
import type { IExerciseCreate } from '@/src/models/domain/exercise';
import { ExerciseSchema } from '@/src/schemas/index';
import { ExerciseLogType } from '@/src/types/enums';
import { LogTypeSelect } from '../common/log-type-select';
import { MuscleGroupSelect } from '../common/muscle-group-select';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Create a type that matches the refined schema
type ExerciseFormData = z.infer<typeof ExerciseSchema>;

interface ExerciseFormProps {
    title: string;
    exercise: IExerciseCreate;
    isLoading: boolean;
    onSubmit: (exercise: IExerciseCreate) => void;
    cancelHref: string;
}

export function ExerciseForm({
    title,
    exercise,
    isLoading,
    onSubmit,
    cancelHref,
}: ExerciseFormProps) {
    // Initialize the form with react-hook-form and zod validation
    const form = useForm<ExerciseFormData>({
        resolver: zodResolver(ExerciseSchema) as any,
        defaultValues: {
            name: exercise.name,
            muscleGroupId: exercise.muscleGroupId,
            exerciseLogType:
                exercise.exerciseLogType === ExerciseLogType.Unknown
                    ? undefined
                    : (exercise.exerciseLogType as ExerciseFormData['exerciseLogType']),
            description: exercise.description || '',
        },
    });

    // Handle form submission
    const handleSubmit = (values: ExerciseFormData) => {
        onSubmit({
            ...exercise,
            ...values,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        {/* Name field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <IconInput
                                            icon={Target}
                                            label="Name *"
                                            placeholder="Exercise name"
                                            {...field}
                                        />
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
                                    <FormControl>
                                        <IconTextarea
                                            icon={StickyNote}
                                            label="Description"
                                            placeholder="Exercise description (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Form buttons */}
                        <div className="flex md:flex-row flex-col-reverse justify-end gap-4">
                            <Button variant="outline" type="button">
                                <Link href={cancelHref}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>Save</>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
