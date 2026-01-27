import { Container } from '@/src/components/common/container';
import { ClientWorkoutTemplateForm } from '@/src/components/workout-template/client-workout-template-form';
import type { IWorkoutTemplateCreate } from '@/src/models/domain/workout-template';

export default function CreateWorkoutTemplatePage() {
	const formData: IWorkoutTemplateCreate = {
		name: '',
		exercises: [],
	};

	return (
		<Container>
			<ClientWorkoutTemplateForm
				title="Create New Workout Template"
				template={formData}
				cancelHref="/workout-templates"
			/>
		</Container>
	);
}
