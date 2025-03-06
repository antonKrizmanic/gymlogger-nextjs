import { cn } from "@/lib/utils";
import { IExerciseCreate } from "@/src/Models/Domain/Exercise";
import { useState } from "react";
import { MuscleGroupSelect } from "../Common/MuscleGroupSelect";
import { LogTypeSelect } from "../Common/LogTypeSelect";

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
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={cn(
                                'mt-1 w-full px-3 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                'text-gray-900 dark:text-white'
                            )}
                        />
                    </div>

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
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className={cn(
                                'mt-1 w-full px-3 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                'text-gray-900 dark:text-white'
                            )}
                        />
                    </div>

                    {/* Form buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className={cn(
                                'px-4 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'text-gray-700 dark:text-gray-300',
                                'hover:bg-gray-50 dark:hover:bg-slate-700'
                            )}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                'px-4 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'text-gray-700 dark:text-gray-300',
                                'hover:bg-gray-50 dark:hover:bg-slate-700',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'flex items-center gap-2'
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-gray-700 dark:border-gray-300 rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
