'use client';

import { ActionButton } from '@/components/Common/ActionButton';
import { PlusIcon } from '@/components/Icons';
import { Container } from '@/components/ui/Container';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();    

    const handleClick = () => {
        router.push(`/workouts/create`);
    }    

    return (
        <Container>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to GymLogger</h1>
            <p className="mt-4 text-lg text-gray-600">
                Track your workouts and progress with ease.
            </p>
            <ActionButton onClick={handleClick}>
                <PlusIcon />
                Add Workout
            </ActionButton>
        </Container>
    );
}
