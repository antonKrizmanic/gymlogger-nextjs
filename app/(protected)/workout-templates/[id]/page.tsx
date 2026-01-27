'use client';

import { Dumbbell, Edit } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { WorkoutTemplateApiService } from '@/src/api/services/workout-template-api-service';
import { Container } from '@/src/components/common/container';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import type { IWorkoutTemplate } from '@/src/models/domain/workout-template';

export default function ViewWorkoutTemplatePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [template, setTemplate] = useState<IWorkoutTemplate | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTemplate = async () => {
            setIsLoading(true);
            try {
                const service = new WorkoutTemplateApiService();
                const response = await service.getWorkoutTemplate(id);
                setTemplate(response);
            } catch (error) {
                console.error('Failed to fetch template:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTemplate();
    }, [id]);

    if (isLoading) {
        return (
            <Container>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Container>
        );
    }

    if (!template) {
        return (
            <Container>
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        Template not found
                    </p>
                    <Button asChild>
                        <Link href="/workout-templates">Back to Templates</Link>
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            <Container>
                {/* Hero Section */}
                <div className="space-y-6 pb-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground flex items-center">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                <Dumbbell className="h-8 w-8 text-primary" />
                            </div>
                            {template.name}
                        </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="px-6 py-3 text-lg font-semibold"
                        >
                            <Link href={`/workout-templates/${id}/edit`}>
                                <Edit className="mr-2 h-5 w-5" />
                                Edit Template
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="px-6 py-3 text-lg font-semibold"
                        >
                            <Link href="/workout-templates">
                                Back to Templates
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Template Details */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-foreground flex items-center">
                            <Dumbbell className="mr-2 h-6 w-6 text-primary" />
                            Exercises
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {template.exercises.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No exercises in this template
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {template.exercises.map((exercise, index) => (
                                    <div
                                        key={exercise.id}
                                        className="border rounded-lg p-4 flex justify-between items-center"
                                    >
                                        <div>
                                            <h4 className="font-medium">
                                                {index + 1}.{' '}
                                                {exercise.exerciseName}
                                            </h4>
                                            {exercise.exerciseDescription && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {
                                                        exercise.exerciseDescription
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {exercise.sets} sets ×{' '}
                                                {exercise.reps} reps
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
