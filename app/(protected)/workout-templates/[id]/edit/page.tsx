'use client';

import { use, useEffect, useState } from 'react';
import { WorkoutTemplateApiService } from '@/src/api/services/workout-template-api-service';
import { Container } from '@/src/components/common/container';
import { ClientWorkoutTemplateForm } from '@/src/components/workout-template/client-workout-template-form';
import type { IWorkoutTemplate } from '@/src/models/domain/workout-template';

export default function EditWorkoutTemplatePage({
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
                    <p className="text-muted-foreground">Template not found</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <ClientWorkoutTemplateForm
                title="Edit Workout Template"
                template={{
                    name: template.name,
                    exercises: template.exercises.map((e) => ({
                        exerciseId: e.exerciseId,
                        sets: e.sets,
                        reps: e.reps,
                        index: e.index,
                    })),
                }}
                id={id}
                cancelHref={`/workout-templates/${id}`}
            />
        </Container>
    );
}
