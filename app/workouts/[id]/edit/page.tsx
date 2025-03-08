'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutService } from '@/src/Api/Services/WorkoutService';
import { IWorkoutCreate, IWorkoutUpdate } from '@/src/Models/Domain/Workout';
import { ErrorSnackbar, SuccessSnackbar } from '@/components/Common/Snackbar';
import { WorkoutForm } from '@/components/Workout/WorkoutForm';
import { Container } from '@/components/ui/Container';


type EditWorkoutPageProps = Promise<{
    id: string;
}>

export default function EditWorkoutPage(props: {params:EditWorkoutPageProps}) {
    const params = use(props.params);
    const id = params.id;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [isSuccessSnackbarVisible, setIsSuccessSnackbarVisible] = useState(false);
    const [isErrorSnackbarVisible, setIsErrorSnackbarVisible] = useState(false);
    const [formData, setFormData] = useState<IWorkoutCreate>({
        name: '',
        description: '',
        date: new Date(),
        exercises: []
    });

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                setIsFetching(true);
                const service = new WorkoutService();
                const workout = await service.getWorkoutForEdit(id);
                console.log(workout);
                setFormData(workout);
            } catch (error) {
                console.error('Failed to fetch workout:', error);
                setIsErrorSnackbarVisible(true);
            } finally {
                setIsFetching(false);
            }
        };

        fetchWorkout();
    }, [id, router]);

    const handleSubmit = async (workout: IWorkoutCreate) => {        
        setIsLoading(true);

        try {
            const service = new WorkoutService();
            const updateData: IWorkoutUpdate = {
                ...workout,
                id: id
            };
            await service.updateWorkout(id, updateData);
            setIsSuccessSnackbarVisible(true);
            router.push('/workouts');
        } catch (error) {
            console.error('Failed to update workout:', error);
            setIsErrorSnackbarVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/workouts');
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
            <WorkoutForm
                title="Edit Workout"
                workout={formData}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                workoutId={id}
            />

            <SuccessSnackbar
                isVisible={isSuccessSnackbarVisible}
                onClose={() => setIsSuccessSnackbarVisible(false)}
            />
            <ErrorSnackbar
                isVisible={isErrorSnackbarVisible}
                onClose={() => setIsErrorSnackbarVisible(false)}
            />
        </Container>
    );
} 