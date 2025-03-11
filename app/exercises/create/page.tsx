import { ExerciseLogType } from '@/src/Types/Enums';
import { IExerciseCreate } from '@/src/Models/Domain/Exercise';
import { Container } from '@/components/Common/Container';
import { ClientExerciseForm } from '@/components/Exercise/ClientExerciseForm';

export default function CreateExercisePage() {
    // Define initial form data
    const formData: IExerciseCreate = {
        name: '',
        muscleGroupId: '',
        description: '',
        exerciseLogType: ExerciseLogType.WeightAndReps
    };    

    return (
        <Container>
            <ClientExerciseForm
                title="Create New Exercise"
                exercise={formData}
                cancelHref="/exercises"
            />
        </Container>
    );
}