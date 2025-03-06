'use client';

import { Container } from '@/components/ui/Container';

export default function HomePage() {
    return (
        <Container>
            <div className="pt-8">
            <h1 className="text-4xl font-bold">Welcome to GymLogger</h1>
            <p className="mt-4 text-lg text-gray-600">
                Track your workouts and progress with ease.
            </p>
            </div>
        </Container>
    );
}
