'use client';

import { ExerciseLogType } from '@/src/types/enums';
import { IExerciseCreate } from '@/src/models/domain/exercise';
import { Container } from '@/src/components/common/container';
import { ClientExerciseForm } from '@/src/components/exercise/client-exercise-form';

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