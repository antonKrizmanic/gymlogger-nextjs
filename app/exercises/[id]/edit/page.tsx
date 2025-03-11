import { ExerciseService } from '@/src/Api/Services/ExerciseService';
import { ExerciseLogType } from '@/src/Types/Enums';
import { IExerciseCreate } from '@/src/Models/Domain/Exercise';
import { Container } from '@/components/Common/Container';
import { ClientExerciseForm } from '@/components/Exercise/ClientExerciseForm';
import { notFound } from 'next/navigation';

// Server-side data fetching
async function getExercise(id: string) {
    try {
        const service = new ExerciseService();
        const exercise = await service.getExercise(id);
        return exercise;
    } catch (error) {
        console.error('Error fetching exercise:', error);
        return null;
    }
}

export default async function EditExercisePage({ params }: { params: { id: string } }) {
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