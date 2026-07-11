'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dumbbell, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ExerciseApiService } from '@/src/api/services/exercise-api-service';
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
import { ExerciseSelect } from '@/src/components/workout/exercise-select';
import type { IExercise } from '@/src/models/domain/exercise';
import type { IWorkoutTemplateCreate } from '@/src/models/domain/workout-template';
import {
    type WorkoutTemplateSchema,
    workoutTemplateSchema,
} from '@/src/schemas/index';
import { TemplateExerciseListItem } from './template-exercise-list-item';

interface WorkoutTemplateFormProps {
    templateId: string | null;
    title: string;
    template: IWorkoutTemplateCreate;
    isLoading: boolean;
    onSubmit: (template: IWorkoutTemplateCreate) => void;
    cancelHref: string;
}

export function WorkoutTemplateForm({
    templateId,
    title,
    template,
    isLoading,
    onSubmit,
    cancelHref,
}: WorkoutTemplateFormProps) {
    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

    const form = useForm<WorkoutTemplateSchema>({
        resolver: zodResolver(workoutTemplateSchema),
        defaultValues: {
            name: template.name || '',
            exercises: template.exercises || [],
        },
    });

    const { fields, append, replace } = useFieldArray({
        control: form.control,
        name: 'exercises',
    });

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const service = new ExerciseApiService();
                const response = await service.getAllExercises();
                setExercises(response || []);
            } catch (error) {
                console.error('Failed to fetch exercises:', error);
            }
        };
        fetchExercises();
    }, []);

    const handleAddExercise = () => {
        if (!selectedExerciseId) return;
        if (fields.some((field) => field.exerciseId === selectedExerciseId)) {
            form.setError('exercises', {
                message: 'Each exercise can only be added once',
            });
            return;
        }

        form.clearErrors('exercises');
        append({
            exerciseId: selectedExerciseId,
            sets: 3,
            reps: 10,
            index: fields.length,
        });
        setSelectedExerciseId('');
    };

    const handleRemoveExercise = (index: number) => {
        const remainingExercises = form
            .getValues('exercises')
            .filter((_, exerciseIndex) => exerciseIndex !== index)
            .map((exercise, exerciseIndex) => ({
                ...exercise,
                index: exerciseIndex,
            }));
        replace(remainingExercises);
    };

    const handleSubmit = (data: WorkoutTemplateSchema) => {
        const orderedExercises = data.exercises.map((exercise, index) => ({
            ...exercise,
            index,
        }));
        const formattedData = {
            ...data,
            exercises: orderedExercises,
        };

        onSubmit(formattedData as IWorkoutTemplateCreate);
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground">
                    Create a reusable workout template with exercises, sets, and
                    reps
                </p>
            </div>

            <Card className="border-2 shadow-xl">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Dumbbell className="h-5 w-5 text-primary" />
                        </div>
                        <span>Template Details</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-6"
                        >
                            {/* Name field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <IconInput
                                                icon={Dumbbell}
                                                placeholder="Template name (e.g., Push Day, Leg Day)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Exercise Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Exercises
                                </h3>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <ExerciseSelect
                                            selectedExerciseId={
                                                selectedExerciseId
                                            }
                                            onExerciseSelect={
                                                setSelectedExerciseId
                                            }
                                            placeholder="Select an exercise to add..."
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleAddExercise}
                                        disabled={!selectedExerciseId}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </div>

                                {/* Exercise List */}
                                <div className="space-y-3">
                                    {fields.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No exercises added yet. Add at least
                                            one exercise to create a template.
                                        </div>
                                    ) : (
                                        fields.map((field, index) => {
                                            const exercise = exercises.find(
                                                (e) =>
                                                    e.id === field.exerciseId,
                                            );
                                            return (
                                                <TemplateExerciseListItem
                                                    key={field.id}
                                                    form={form}
                                                    index={index}
                                                    exerciseName={
                                                        exercise?.name
                                                    }
                                                    onRemove={() =>
                                                        handleRemoveExercise(
                                                            index,
                                                        )
                                                    }
                                                />
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 sm:flex-none px-8"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {templateId
                                                ? 'Updating...'
                                                : 'Creating...'}
                                        </>
                                    ) : templateId ? (
                                        'Update Template'
                                    ) : (
                                        'Create Template'
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    className="flex-1 sm:flex-none px-8"
                                >
                                    <Link href={cancelHref}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
