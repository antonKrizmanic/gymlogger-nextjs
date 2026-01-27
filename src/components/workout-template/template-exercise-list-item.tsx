'use client';

import { Trash2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import type { WorkoutTemplateSchema } from '@/src/schemas';

interface TemplateExerciseListItemProps {
	form: UseFormReturn<WorkoutTemplateSchema>;
	index: number;
	exerciseName?: string;
	onRemove: () => void;
}

export function TemplateExerciseListItem({
	form,
	index,
	exerciseName,
	onRemove,
}: TemplateExerciseListItemProps) {
	return (
		<div className="border rounded-lg p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h4 className="font-medium">{exerciseName || 'Exercise'}</h4>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={onRemove}
					className="text-destructive hover:text-destructive"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name={`exercises.${index}.sets`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Sets</FormLabel>
							<FormControl>
								<Input
									type="number"
									min="1"
									{...field}
									onChange={(e) =>
										field.onChange(Number(e.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name={`exercises.${index}.reps`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Reps</FormLabel>
							<FormControl>
								<Input
									type="number"
									min="1"
									{...field}
									onChange={(e) =>
										field.onChange(Number(e.target.value))
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
