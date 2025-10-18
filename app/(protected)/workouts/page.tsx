'use client';
import { Calendar, Dumbbell, Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense, useState } from 'react';
import { Container } from '@/src/components/common/container';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { WorkoutsIndex } from '@/src/views/workout/workouts-index';

// Create a client component that uses searchParams
const WorkoutsContent = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Listen for the toggle filter event
    React.useEffect(() => {
        const handleToggleFilter = () => {
            setIsFilterOpen((prev) => !prev);
        };

        window.addEventListener('toggleFilter', handleToggleFilter);
        return () =>
            window.removeEventListener('toggleFilter', handleToggleFilter);
    }, []);

    return <WorkoutsIndex isFilterOpen={isFilterOpen} />;
};

// Main page component with Suspense boundary
export default function WorkoutsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            <Container>
                {/* Hero Section */}
                <div className="space-y-6 pb-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground flex items-center">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                                <Dumbbell className="h-8 w-8 text-primary" />
                            </div>
                            Your Workouts
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                            Track your fitness journey with detailed workout
                            logs. Monitor your progress and achieve your goals
                            one session at a time.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="px-6 py-3 text-lg font-semibold"
                        >
                            <Link href="/workouts/create">
                                <Plus className="mr-2 h-5 w-5" />
                                New Workout
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-6 py-3 text-lg font-semibold"
                            onClick={() => {
                                // This will be handled by the WorkoutsContent component
                                const event = new CustomEvent('toggleFilter');
                                window.dispatchEvent(event);
                            }}
                        >
                            <Filter className="mr-2 h-5 w-5" />
                            Filter & Search
                        </Button>
                    </div>
                </div>

                {/* Workouts List */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-foreground flex items-center">
                            <Calendar className="mr-2 h-6 w-6 text-primary" />
                            Workout History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Suspense
                            fallback={
                                <div className="flex items-center justify-center min-h-[400px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                </div>
                            }
                        >
                            <WorkoutsContent />
                        </Suspense>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
