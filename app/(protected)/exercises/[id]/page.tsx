import { Container } from "@/src/components/Common/Container";
import DeleteExerciseButton from "@/src/components/Exercise/DeleteExerciseButton";
import { ExerciseTabs } from "@/src/components/Exercise/ExerciseTabs";
import { getExercise } from "@/src/data/exercise";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { MoveLeft, Pencil } from "lucide-react";

export default async function ExerciseDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = await params.id;
    const exercise = await getExercise(id);

    if (!exercise) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <p className="text-lg text-gray-600 dark:text-gray-400">Exercise not found</p>
            </div>
        );
    }

    return (
        <Container>
            <div className="space-y-4 pb-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                    {exercise.name || 'Unnamed Exercise'}
                </h1>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    {/* Back button */}
                    <Button asChild>
                        <Link href="/exercises">
                            <MoveLeft />
                            Back
                        </Link> 
                    </Button>                      
                    <Button asChild> 
                    <Link href={`/exercises/${exercise.id}/edit`}>
                        <Pencil /> Edit
                    </Link>
                    </Button>
                    <DeleteExerciseButton exercise={exercise} />
                </div>
                
                {/* Exercise details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exercise Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400">Muscle Group</h3>
                                <p className="text-gray-500 dark:text-gray-100">{exercise.muscleGroupName}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400">Log Type</h3>
                                <p className="text-gray-500 dark:text-gray-100">
                                    {exercise.exerciseLogType === 1
                                        ? "Weight and Reps"
                                        : exercise.exerciseLogType === 2
                                        ? "Reps Only"
                                        : exercise.exerciseLogType === 3
                                        ? "Time Only"
                                        : "Unknown"}
                                </p>
                            </div>
                        </div>
                        
                        {exercise.description && (
                            <div className="mt-4">
                                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-400">Description</h3>
                                <p className="text-gray-500 dark:text-gray-100 whitespace-pre-wrap">{exercise.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                {/* Tabbed interface for history and progress */}
                <ExerciseTabs exerciseId={exercise.id} />
            </div>
        </Container>
    );
}
