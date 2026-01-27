'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { WorkoutTemplateApiService } from '@/src/api/services/workout-template-api-service';
import type {
	IWorkoutTemplateCreate,
	IWorkoutTemplateUpdate,
} from '@/src/models/domain/workout-template';
import { WorkoutTemplateForm } from './workout-template-form';

interface ClientWorkoutTemplateFormProps {
	title: string;
	template: IWorkoutTemplateCreate;
	id?: string; // Optional id for edit mode
	cancelHref: string;
}

export function ClientWorkoutTemplateForm({
	title,
	template,
	id,
	cancelHref,
}: ClientWorkoutTemplateFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (formData: IWorkoutTemplateCreate) => {
		// Basic validation
		if (!formData.name) {
			toast.error('Name is required');
			return;
		}

		setIsLoading(true);

		try {
			const service = new WorkoutTemplateApiService();

			if (id) {
				// Update existing template
				const updateData: IWorkoutTemplateUpdate = {
					...formData,
					id,
				};
				await service.updateWorkoutTemplate(id, updateData);
				toast.success('Workout template updated successfully!');
				router.push('/workout-templates');
			} else {
				// Create new template
				await service.createWorkoutTemplate(formData);

				toast.success('Workout template created successfully!');
				router.push('/workout-templates');
			}
		} catch (error) {
			console.error(
				`Failed to ${id ? 'update' : 'create'} workout template:`,
				error,
			);
			toast.error(
				`Failed to ${id ? 'update' : 'create'} workout template. Please try again.`,
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<WorkoutTemplateForm
			templateId={id || null}
			title={title}
			template={template}
			isLoading={isLoading}
			onSubmit={handleSubmit}
			cancelHref={cancelHref}
		/>
	);
}
