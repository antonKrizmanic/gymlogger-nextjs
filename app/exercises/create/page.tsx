'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExerciseService } from '@/src/Api/Services/ExerciseService';
import { ExerciseLogType } from '@/src/Types/Enums';
import { IExerciseCreate } from '@/src/Models/Domain/Exercise';
import { ExerciseForm } from '@/components/Exercise/ExerciseForm';
import { ErrorSnackbar, SuccessSnackbar } from '@/components/Common/Snackbar';
import { Container } from '@/components/Common/Container';

export default function CreateExercisePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessSnackbarVisible, setIsSuccessSnackbarVisible] = useState(false);
    const [isErrorSnackbarVisible, setIsErrorSnackbarVisible] = useState(false);
    const [formData] = useState<IExerciseCreate>({
        name: '',
        muscleGroupId: '',
        description: '',
        exerciseLogType: ExerciseLogType.WeightAndReps
    });    

    const handleSubmit = async (exercise: IExerciseCreate) => {        
        setIsLoading(true);

        try {
            const service = new ExerciseService();
            await service.createExercise(exercise);
            setIsSuccessSnackbarVisible(true);
            router.push('/exercises');
        } catch (error) {
            console.error('Failed to create exercise:', error);
            setIsErrorSnackbarVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <ExerciseForm
                title="Create New Exercise"
                exercise={formData}
                onSubmit={handleSubmit}
                cancelHref="/exercises"
                isLoading={isLoading}
            />
            <SuccessSnackbar
                text="Exercise created successfully!"
                isVisible={isSuccessSnackbarVisible}          
                onClose={() => setIsSuccessSnackbarVisible(false)}
            />
            <ErrorSnackbar
                text="Exercise creation failed!"
                isVisible={isErrorSnackbarVisible}
                onClose={() => setIsErrorSnackbarVisible(false)}
            />
        </Container>
    );
} 