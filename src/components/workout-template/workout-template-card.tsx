'use client';

import { Dumbbell, Edit, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { WorkoutTemplateApiService } from '@/src/api/services/workout-template-api-service';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import type { IWorkoutTemplateSimple } from '@/src/models/domain/workout-template';

interface WorkoutTemplateCardProps {
    template: IWorkoutTemplateSimple;
    onDelete?: () => void;
}

export function WorkoutTemplateCard({
    template,
    onDelete,
}: WorkoutTemplateCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
            )
        ) {
            return;
        }

        setIsDeleting(true);
        try {
            const service = new WorkoutTemplateApiService();
            await service.deleteWorkoutTemplate(template.id);
            toast.success('Template deleted successfully');
            onDelete?.();
        } catch (error) {
            console.error('Failed to delete template:', error);
            toast.error('Failed to delete template');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Created:{' '}
                    {template.createdAt
                        ? new Date(template.createdAt).toLocaleDateString()
                        : 'N/A'}
                </p>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button asChild size="sm" className="flex-1">
                    <Link href={`/workouts/create?templateId=${template.id}`}>
                        <Dumbbell className="h-4 w-4 mr-2" />
                        Start
                    </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/workout-templates/${template.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                    </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/workout-templates/${template.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    disabled={isDeleting}
                    onClick={handleDelete}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
