'use client';

import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WorkoutTemplateApiService } from '@/src/api/services/workout-template-api-service';
import {
    type ComboboxItem,
    ResponsiveCombobox,
} from '@/src/components/form/responsive-combobox';
import type { IWorkoutTemplateSimple } from '@/src/models/domain/workout-template';
import { SortDirection } from '@/src/types/enums';

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
    const [internalSelectedId, setInternalSelectedId] = useState(
        selectedTemplateId || '',
    );

    useEffect(() => {
        setInternalSelectedId(selectedTemplateId || '');
    }, [selectedTemplateId]);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const service = new WorkoutTemplateApiService();
                const request = {
                    page: 0,
                    pageSize: 100,
                    sortColumn: 'createdAt',
                    sortDirection: SortDirection.Descending,
                };
                const firstPage = await service.getWorkoutTemplates(request);
                const remainingPages = await Promise.all(
                    Array.from(
                        {
                            length: Math.max(
                                0,
                                firstPage.pagingData.totalPages - 1,
                            ),
                        },
                        (_, index) =>
                            service.getWorkoutTemplates({
                                ...request,
                                page: index + 1,
                            }),
                    ),
                );

                setTemplates([
                    ...firstPage.items,
                    ...remainingPages.flatMap((page) => page.items),
                ]);
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
        selectOptions.find((o) => o.value === internalSelectedId) || null;

    return (
        <ResponsiveCombobox
            icon={FileText}
            label={label}
            placeholder={placeholder}
            emptyMessage="No templates found"
            filterPlaceholder="Search templates..."
            value={selectedItem}
            onValueChange={(item) => {
                const templateId = item?.value || '';
                setInternalSelectedId(templateId);
                onTemplateSelect(templateId);
            }}
            items={selectOptions}
            className={className}
        />
    );
}
