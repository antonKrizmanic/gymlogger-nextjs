import { Container } from '@/src/components/common/container';
import { ClientWorkoutForm } from '@/src/components/workout/client-workout-form';
import { getLoggedInUser } from '@/src/data/loggedInUser';
import { getWorkout } from '@/src/data/workout';
import { getWorkoutTemplate } from '@/src/data/workout-template';
import {
    createWorkoutFromPrevious,
    createWorkoutFromTemplate,
    resolveWorkoutCreateSource,
} from '@/src/lib/workout-source';
import type { IWorkoutCreate } from '@/src/models/domain/workout';

type CreateWorkoutPageProps = {
    searchParams: Promise<{
        templateId?: string | string[];
        repeatWorkoutId?: string | string[];
    }>;
};

const getSingleParam = (value?: string | string[]) =>
    typeof value === 'string' ? value : undefined;

export default async function CreateWorkoutPage({
    searchParams,
}: CreateWorkoutPageProps) {
    const params = await searchParams;
    const templateId = getSingleParam(params.templateId);
    const repeatWorkoutId = getSingleParam(params.repeatWorkoutId);
    const sourceResolution = resolveWorkoutCreateSource(
        templateId,
        repeatWorkoutId,
    );
    const loggedInUser = await getLoggedInUser();
    let sourceError = sourceResolution.error;

    let formData: IWorkoutCreate = {
        name: '',
        description: '',
        date: new Date(),
        exercises: [],
    };

    if (sourceResolution.source?.type === 'template' && templateId) {
        const template = await getWorkoutTemplate(templateId);
        if (template) {
            formData = createWorkoutFromTemplate(template);
        } else {
            sourceError = 'The selected workout template is unavailable.';
        }
    } else if (sourceResolution.source?.type === 'repeat' && repeatWorkoutId) {
        const workout = await getWorkout(repeatWorkoutId);
        if (workout) {
            formData = createWorkoutFromPrevious(workout);
        } else {
            sourceError = 'The selected workout is unavailable.';
        }
    }

    return (
        <Container>
            {sourceError && (
                <div
                    role="alert"
                    className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
                >
                    {sourceError}
                </div>
            )}
            <ClientWorkoutForm
                title="Create New Workout"
                workout={formData}
                cancelHref="/workouts"
                userId={loggedInUser?.id}
                source={sourceResolution.source}
            />
        </Container>
    );
}
