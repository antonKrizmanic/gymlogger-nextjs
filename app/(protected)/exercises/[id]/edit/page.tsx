import { notFound } from 'next/navigation';
import { Container } from '@/src/components/common/container';
import { ClientExerciseForm } from '@/src/components/exercise/client-exercise-form';
import { getExercise } from '@/src/data/exercise';
import type { IExerciseCreate } from '@/src/models/domain/exercise';
import type { ExerciseLogType } from '@/src/types/enums';

export default async function EditExercisePage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const exercise = await getExercise(params.id);

    if (!exercise) {
        return notFound();
    }

    // Create exercise data for the form
    const exerciseData: IExerciseCreate = {
        name: exercise.name,
        muscleGroupId: exercise.muscleGroupId,
        description: exercise.description || '',
        exerciseLogType: exercise.exerciseLogType as ExerciseLogType,
    };

    return (
        <Container>
            <ClientExerciseForm
                title="Edit Exercise"
                exercise={exerciseData}
                id={params.id}
                cancelHref="/exercises"
            />
        </Container>
    );
}
