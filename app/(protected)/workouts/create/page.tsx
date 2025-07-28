import { IWorkoutCreate } from '@/src/models/domain/workout';
import { Container } from '@/src/components/common/container';
import { ClientWorkoutForm } from '@/src/components/workout/client-workout-form';

export default function CreateWorkoutPage() {
    // Define initial form data
    const formData: IWorkoutCreate = {
        name: '',
        description: '',
        date: new Date(),
        exercises: []
    };

    return (
        <Container>
            <ClientWorkoutForm
                title="Create New Workout"
                workout={formData}
                cancelHref="/workouts"
            />
        </Container>
    );
}