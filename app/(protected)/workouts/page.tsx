"use client";
import { Container } from '@/src/components/common/container';
import { Button } from '@/src/components/ui/button';
import { WorkoutsIndex } from '@/src/views/workout/workouts-index';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, Suspense } from 'react';

// Create a client component that uses searchParams
const WorkoutsContent = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    return (
        <>
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button asChild className="hover:cursor-pointer hover:opacity-95 transition-opacity duration-200 ease-in-out">
                            <Link href='/workouts/create'>
                                <Plus />
                                New
                            </Link>
                        </Button>
                        <Button onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="hover:cursor-pointer hover:opacity-95 transition-opacity duration-200 ease-in-out">
                            <Filter />
                            Filter
                        </Button>
                    </div>
                </div>
            </div>
            <WorkoutsIndex
                isFilterOpen={isFilterOpen}
            />
        </>
    );
};

// Main page component with Suspense boundary
export default function WorkoutsPage() {
    return (
        <Container>
            <div className="pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Workouts</h1>
            </div>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            }>
                <WorkoutsContent />
            </Suspense>
        </Container>
    );
}