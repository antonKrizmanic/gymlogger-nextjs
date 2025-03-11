import { ExerciseService } from "@/src/Api/Services/ExerciseService";
import { Container } from "@/components/Common/Container";
import { ActionButton } from "@/components/Common/ActionButton";
import { LeftArrowIcon, PencilIcon } from "@/components/Icons";
import DeleteExerciseButton from "@/components/Exercise/DeleteExerciseButton";

async function getExercise(id: string) {
    const service = new ExerciseService();
    return service.getExercise(id);
}

export default async function ExerciseDetailPage({ params }: { params: { id: string } }) {
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
                    <ActionButton href="/exercises">
                        <LeftArrowIcon />
                        Back
                    </ActionButton>                        
                    <ActionButton href={`/exercises/${exercise.id}/edit`}>
                        <PencilIcon /> Edit
                    </ActionButton>
                    <DeleteExerciseButton exercise={exercise} />
                </div>
            </div>
        </Container>
    );
}
