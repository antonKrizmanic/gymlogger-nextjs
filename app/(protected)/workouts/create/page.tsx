import { IWorkoutCreate } from '@/src/Models/Domain/Workout';
import { Container } from '@/src/components/Common/Container';
import { ClientWorkoutForm } from '@/src/components/Workout/ClientWorkoutForm';

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