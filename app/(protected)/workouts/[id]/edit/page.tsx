import { WorkoutApiService } from '@/src/Api/Services/WorkoutApiService';
import { Container } from '@/src/components/Common/Container';
import { ClientWorkoutForm } from '@/src/components/Workout/ClientWorkoutForm';
import { IWorkoutCreate } from '@/src/Models/Domain/Workout';

async function getWorkout(id: string) {
    const service = new WorkoutApiService();
    return service.getWorkout(id);
}

export default async function EditWorkoutPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = await params.id;
    const workout = await getWorkout(id);

    if (!workout) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <p className="text-lg text-gray-600 dark:text-gray-400">Workout not found</p>
            </div>
        );
    }

    const workoutCreate: IWorkoutCreate = {
        name: workout.name,
        description: workout.description,
        date: workout.date,
        exercises: workout.exercises
    };

    return (
        <Container>
            <ClientWorkoutForm
                title="Edit Workout"
                workout={workoutCreate}
                id={id}
                cancelHref="/workouts"
            />
        </Container>
    );
}