import { Container } from "@/src/components/Common/Container";
import DeleteExerciseButton from "@/src/components/Exercise/DeleteExerciseButton";
import { getExercise } from "@/src/data/exercise";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
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
            </div>
        </Container>
    );
}
