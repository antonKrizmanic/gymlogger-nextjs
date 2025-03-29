import { ExerciseLogType } from '@/src/types/enums';
import { IExerciseCreate } from '@/src/models/domain/exercise';
import { Container } from '@/src/components/common/container';
import { ClientExerciseForm } from '@/src/components/exercise/client-exercise-form';
import { notFound } from 'next/navigation';
import { getExercise } from '@/src/data/exercise';


export default async function EditExercisePage(props: { params: Promise<{ id: string }> }) {
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
        exerciseLogType: exercise.exerciseLogType as ExerciseLogType
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