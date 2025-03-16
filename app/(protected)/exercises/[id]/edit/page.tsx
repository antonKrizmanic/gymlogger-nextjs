import { ExerciseApiService } from '@/src/Api/Services/ExerciseApiService';
import { ExerciseLogType } from '@/src/Types/Enums';
import { IExerciseCreate } from '@/src/Models/Domain/Exercise';
import { Container } from '@/src/components/Common/Container';
import { ClientExerciseForm } from '@/src/components/Exercise/ClientExerciseForm';
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