'use client';
import { IWorkoutCreate } from "@/src/Models/Domain/Workout";
import { useState } from "react";
import { ExerciseList } from "./ExerciseList";
import { DateInput, TextInput } from "../Form/TextInput";
import { SaveIcon } from "../Icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface WorkoutFormProps {
    workoutId: string | null;
    title: string;
    workout: IWorkoutCreate;
    isLoading: boolean;
    onSubmit: (workout: IWorkoutCreate) => void;
    cancelHref: string;
}

export function WorkoutForm({ workoutId, title, workout, isLoading, onSubmit, cancelHref }: WorkoutFormProps) {

    const [formData, setFormData] = useState<IWorkoutCreate>(workout);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name field */}
                    <TextInput label="Name" id="name" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} />

                    {/* Date field */}
                    <DateInput label="Date" id="date" value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} onChange={(value) => setFormData({ ...formData, date: new Date(value) })} />

                    {/* Description field */}
                    <TextInput label="Description" id="description" value={formData.description || ''} onChange={(value) => setFormData({ ...formData, description: value })} />

                    {/* Exercise list */}
                    <ExerciseList
                        workoutId={workoutId}
                        exercises={formData.exercises || []}
                        onExercisesChange={(exercises) => setFormData({ ...formData, exercises })}
                    />

                    {/* Submit and Cancel buttons */}
                    <div className="flex md:flex-row flex-col justify-end gap-4">
                        <Button variant="outline">
                            <Link className="justify-center" href={cancelHref}>Cancel</Link>
                        </Button>
                        {isLoading &&
                            <Button className="justify-center" type="submit" disabled>
                                <Loader2 className="animate-spin" size={16} />
                                Saving...
                            </Button>
                        }
                        {!isLoading &&
                            <Button className="justify-center" type="submit" >
                                <SaveIcon /> Save
                            </Button>
                        }
                    </div>
                </form>
            </CardContent>

        </Card>
    );
}
