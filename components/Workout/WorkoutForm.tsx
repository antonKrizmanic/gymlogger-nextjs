import { IWorkoutCreate } from "@/src/Models/Domain/Workout";
import { useState } from "react";
import { ExerciseList } from "./ExerciseList";
import { ActionButton } from "../Common/ActionButton";
import { DateInput, TextInput } from "../Form/TextInput";
import { TextareaInput } from "../Form/TextareaInput";

interface WorkoutFormProps {
    title: string;
    workout: IWorkoutCreate;
    isLoading: boolean;
    onSubmit: (workout: IWorkoutCreate) => void;
    onCancel: () => void;
}

export function WorkoutForm({ title, workout, isLoading, onSubmit, onCancel }: WorkoutFormProps) {

    const [formData, setFormData] = useState<IWorkoutCreate>(workout);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{title}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name field */}
                    <TextInput label="Name" id="name" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} />

                    {/* Date field */}
                    <DateInput label="Date" id="date" value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} onChange={(value) => setFormData({ ...formData, date: new Date(value) })} />

                    {/* Description field */}
                    <TextareaInput label="Description" id="description" value={formData.description || ''} onChange={(value) => setFormData({ ...formData, description: value })} />

                    {/* Exercise list */}
                    <ExerciseList
                        exercises={formData.exercises || []}
                        onExercisesChange={(exercises) => setFormData({ ...formData, exercises })}
                    />

                    {/* Submit and Cancel buttons */}
                    <div className="flex justify-end gap-4">
                        <ActionButton onClick={onCancel}>Cancel</ActionButton>
                        <ActionButton type="submit" isLoading={isLoading} loadingText="Saving..." >Save</ActionButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
