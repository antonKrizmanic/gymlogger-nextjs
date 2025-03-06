import { IExerciseCreate } from "@/src/Models/Domain/Exercise";
import { useState } from "react";
import { MuscleGroupSelect } from "../Common/MuscleGroupSelect";
import { LogTypeSelect } from "../Common/LogTypeSelect";
import { ActionButton } from "../Common/ActionButton";
import { TextInput } from "../Form/TextInput";
import { TextareaInput } from "../Form/TextareaInput";

interface ExerciseFormProps {
    title: string;
    exercise: IExerciseCreate;
    isLoading: boolean;
    onSubmit: (exercise: IExerciseCreate) => void;
    onCancel: () => void;
}

export function ExerciseForm({ title, exercise, isLoading, onSubmit, onCancel }: ExerciseFormProps) {    
    const [formData, setFormData] = useState<IExerciseCreate>(exercise);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();        
        onSubmit(formData);        
    }

    return(
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{title}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name field */}
                    <TextInput label="Name *" id="name" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} />
                    
                    {/* Muscle Group field */}
                    <div>
                        <MuscleGroupSelect
                            selectedMuscleGroup={formData.muscleGroupId}
                            onMuscleGroupChange={(e) => setFormData({ ...formData, muscleGroupId: e })}
                        />
                    </div>

                    {/* Exercise Log Type field */}
                    <div>
                        <LogTypeSelect
                            selectedLogType={formData.exerciseLogType}
                            onLogTypeChange={(logType) => setFormData({ ...formData, exerciseLogType: logType })}
                            required
                        />
                    </div>

                    {/* Description field */}
                    <TextareaInput label="Description" id="description" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} />

                    {/* Form buttons */}
                    <div className="flex justify-end gap-4">
                        <ActionButton onClick={onCancel}>Cancel</ActionButton>
                        <ActionButton type="submit" isLoading={isLoading} loadingText="Saving..." >Save</ActionButton>                        
                    </div>
                </form>
            </div>
        </div>
    );
}
