'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExerciseService } from '@/src/Api/Services/ExerciseService';
import { ExerciseLogType } from '@/src/Types/Enums';
import { cn } from '@/lib/utils';
import { MuscleGroupSelect } from '@/components/Common/MuscleGroupSelect';
import { LogTypeSelect } from '@/components/Common/LogTypeSelect';
import { IExerciseCreate } from '@/src/Models/Domain/Exercise';
import { ExerciseForm } from '@/components/Exercise/ExerciseForm';

interface EditExercisePageProps {
    params: {
        id: string;
    };
}

export default function EditExercisePage({ params }: EditExercisePageProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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
                const exercise = await exerciseService.getExercise(params.id);
                
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
    }, [params.id, router]);

    const handleSubmit = async (exercise: IExerciseCreate) => {
        setIsLoading(true);

        try {
            const service = new ExerciseService();
            await service.updateExercise(params.id, {
                ...exercise,
                id: params.id
            });
            router.push('/exercises');
        } catch (error) {
            console.error('Failed to update exercise:', error);
            // Here you might want to show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/exercises');
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <ExerciseForm
            title="Edit Exercise"
            exercise={formData}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
} 