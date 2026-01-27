'use client';

import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WorkoutTemplateApiService } from '@/src/api/services/workout-template-api-service';
import {
	type ComboboxItem,
	ResponsiveCombobox,
} from '@/src/components/form/responsive-combobox';
import type { IWorkoutTemplateSimple } from '@/src/models/domain/workout-template';

interface WorkoutTemplateSelectProps {
	selectedTemplateId?: string;
	onTemplateSelect: (templateId: string) => void;
	label?: string;
	placeholder?: string;
	className?: string;
}

export function WorkoutTemplateSelect({
	selectedTemplateId,
	onTemplateSelect,
	label = 'Load from Template',
	placeholder = 'Select a template...',
	className,
}: WorkoutTemplateSelectProps) {
	const [templates, setTemplates] = useState<IWorkoutTemplateSimple[]>([]);

	useEffect(() => {
		const fetchTemplates = async () => {
			try {
				const service = new WorkoutTemplateApiService();
				const response = await service.getWorkoutTemplates({
					page: 0,
					pageSize: 100, // Get all templates for now
				});

				setTemplates(response.items || []);
			} catch (error) {
				console.error('Failed to fetch templates:', error);
			}
		};
		fetchTemplates();
	}, []);

	// Convert templates to combobox items
	const selectOptions: ComboboxItem[] = templates.map((template) => ({
		value: template.id,
		label: template.name,
	}));

	const selectedItem =
		selectOptions.find((o) => o.value === selectedTemplateId) || null;

	return (
		<ResponsiveCombobox
			icon={FileText}
			label={label}
			placeholder={placeholder}
			emptyMessage="No templates found"
			filterPlaceholder="Search templates..."
			value={selectedItem}
			onValueChange={(item) => onTemplateSelect(item?.value || '')}
			items={selectOptions}
			className={className}
		/>
	);
}
