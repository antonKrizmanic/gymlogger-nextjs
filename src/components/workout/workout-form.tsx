'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dumbbell, Loader2, StickyNote } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { CollapsibleNote } from '@/src/components/common/collapsible-note';
import { DatePicker } from '@/src/components/form/date-picker';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/src/components/ui/form';
import { IconInput } from '@/src/components/ui/icon-input';
import type { IWorkoutCreate } from '@/src/models/domain/workout';
import { type WorkoutSchema, workoutSchema } from '@/src/schemas/index';
import { ExerciseList } from './exercise-list';

interface WorkoutFormProps {
    workoutId: string | null;
    title: string;
    workout: IWorkoutCreate;
    isLoading: boolean;
    onSubmit: (workout: IWorkoutCreate) => void;
    cancelHref: string;
}

export function WorkoutForm({
    workoutId,
    title,
    workout,
    isLoading,
    onSubmit,
    cancelHref,
}: WorkoutFormProps) {
    const form = useForm<WorkoutSchema>({
        resolver: zodResolver(workoutSchema),
        defaultValues: {
            name: workout.name || '',
            date: workout.date ? new Date(workout.date) : new Date(),
            description: workout.description || '',
            exercises: workout.exercises || [],
        },
    });

    const handleSubmit = (data: WorkoutSchema) => {
        // Ensure exercises are in the correct order before submitting
        const orderedExercises = [...data.exercises].sort(
            (a, b) => a.index - b.index,
        );
        const formattedData = {
            ...data,
            exercises: orderedExercises,
        };

        onSubmit(formattedData as IWorkoutCreate);
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground">
                    Create and customize your workout routine
                </p>
            </div>

            <Card className="border-2 shadow-xl">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <span>Workout Details</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <IconInput
                                                    icon={Dumbbell}
                                                    label="Workout Name"
                                                    placeholder="Enter workout name..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date field */}
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    required
                                                    label="Workout Date"
                                                    placeholder="Select workout date..."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Description field */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <CollapsibleNote
                                            label="Description (Optional)"
                                            value={field.value || ''}
                                            onChange={(val) =>
                                                field.onChange(val)
                                            }
                                            icon={StickyNote}
                                            placeholder="Add workout notes or description..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Exercise list */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="exercises"
                                    render={({ field }) => (
                                        <FormItem>
                                            <ExerciseList
                                                workoutId={workoutId}
                                                exercises={field.value}
                                                onExercisesChange={
                                                    field.onChange
                                                }
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit and Cancel buttons */}
                            <div className="flex md:flex-row flex-col-reverse justify-end gap-4">
                                <Button variant="outline" type="button">
                                    <Link
                                        className="flex items-center justify-center w-full h-full"
                                        href={cancelHref}
                                    >
                                        Cancel
                                    </Link>
                                </Button>
                                <Button
                                    className="justify-center"
                                    type="submit"
                                    disabled={isLoading}
                                >
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
        </div>
    );
}
