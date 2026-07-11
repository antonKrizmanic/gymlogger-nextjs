'use client';

import { Dumbbell, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { WorkoutTemplateApiService } from '@/src/api/services/workout-template-api-service';
import { Container } from '@/src/components/common/container';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { WorkoutTemplateCard } from '@/src/components/workout-template/workout-template-card';
import type { IWorkoutTemplateSimple } from '@/src/models/domain/workout-template';
import type { IPagedResponse } from '@/src/types/common';
import { SortDirection } from '@/src/types/enums';

export default function WorkoutTemplatesPage() {
    const [templates, setTemplates] = useState<IWorkoutTemplateSimple[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const loadTemplates = useCallback(async () => {
        setIsLoading(true);
        try {
            const service = new WorkoutTemplateApiService();
            const response: IPagedResponse<IWorkoutTemplateSimple> =
                await service.getWorkoutTemplates({
                    page,
                    pageSize: 12,
                    sortColumn: 'createdAt',
                    sortDirection: SortDirection.Descending,
                });

            setTemplates(response.items);
            setTotalPages(response.pagingData.totalPages);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

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
                            Workout Templates
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                            Create reusable workout templates to quickly start
                            new workout sessions with predefined exercises.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="px-6 py-3 text-lg font-semibold"
                        >
                            <Link href="/workout-templates/create">
                                <Plus className="mr-2 h-5 w-5" />
                                New Template
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Templates List */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-foreground flex items-center">
                            <Dumbbell className="mr-2 h-6 w-6 text-primary" />
                            Your Templates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : templates.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">
                                    No templates found. Create your first
                                    template to get started!
                                </p>
                                <Button asChild>
                                    <Link href="/workout-templates/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Template
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {templates.map((template) => (
                                        <WorkoutTemplateCard
                                            key={template.id}
                                            template={template}
                                            onDelete={loadTemplates}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        <Button
                                            variant="outline"
                                            disabled={page === 0}
                                            onClick={() =>
                                                setPage((p) =>
                                                    Math.max(0, p - 1),
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <span className="px-4 py-2">
                                            Page {page + 1} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            disabled={page >= totalPages - 1}
                                            onClick={() =>
                                                setPage((p) =>
                                                    Math.min(
                                                        totalPages - 1,
                                                        p + 1,
                                                    ),
                                                )
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
