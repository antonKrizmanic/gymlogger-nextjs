import { Container } from '@/src/components/common/container';
import { ClientWorkoutForm } from '@/src/components/workout/client-workout-form';
import type { IWorkoutCreate } from '@/src/models/domain/workout';

export default function CreateWorkoutPage() {
    // Define initial form data - date will be set to current date on client side
    const formData: IWorkoutCreate = {
        name: '',
        description: '',
        date: new Date(), // This will be overridden on client side
        exercises: [],
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
