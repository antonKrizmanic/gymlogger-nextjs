'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExerciseService } from '@/src/Api/Services/ExerciseService';
import { ExerciseLogType } from '@/src/Types/Enums';
import { IExerciseCreate } from '@/src/Models/Domain/Exercise';
import { ExerciseForm } from '@/components/Exercise/ExerciseForm';
import { ErrorSnackbar, SuccessSnackbar } from '@/components/Common/Snackbar';
import { Container } from '@/components/Common/Container';

type EditExercisePageProps = Promise<{
    id: string;
}>

export default function EditExercisePage(props: { params: Promise<EditExercisePageProps> }) {
    const params = use(props.params);
    const id = params.id;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessSnackbarVisible, setIsSuccessSnackbarVisible] = useState(false);
    const [isErrorSnackbarVisible, setIsErrorSnackbarVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState<IExerciseCreate>({
        name: '',
        muscleGroupId: '',
        description: '',
        exerciseLogType: ExerciseLogType.WeightAndReps
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);
                // Fetch exercise data
                const exerciseService = new ExerciseService();
                const exercise = await exerciseService.getExercise(id);

                setFormData({
                    name: exercise.name,
                    muscleGroupId: exercise.muscleGroupId,
                    description: exercise.description || '',
                    exerciseLogType: exercise.exerciseLogType
                });
            } catch (error) {
                console.error('Failed to fetch data:', error);
                router.push('/exercises');
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleSubmit = async (exercise: IExerciseCreate) => {
        setIsLoading(true);

        try {
            const service = new ExerciseService();
            await service.updateExercise(id, {
                ...exercise,
                id: id
            });
            setIsSuccessSnackbarVisible(true);
            router.push('/exercises');
        } catch (error) {
            console.error('Failed to update exercise:', error);
            setIsErrorSnackbarVisible(true);
        } finally {
            setIsLoading(false);
        }
    };


    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <Container>
            <ExerciseForm
                title="Edit Exercise"
                exercise={formData}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                cancelHref="/exercises"
            />

            <SuccessSnackbar
                text="Exercise updated successfully!"
                isVisible={isSuccessSnackbarVisible}
                onClose={() => setIsSuccessSnackbarVisible(false)}
            />
            <ErrorSnackbar
                text="Exercise update failed!"
                isVisible={isErrorSnackbarVisible}
                onClose={() => setIsErrorSnackbarVisible(false)}
            />
        </Container>
    );
} 