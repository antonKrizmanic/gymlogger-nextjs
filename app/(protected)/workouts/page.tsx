"use client";
import { Container } from '@/src/components/common/container';
import { GridPattern } from '@/src/components/common/grid-pattern';
import { Button } from '@/src/components/ui/button';
import { WorkoutsIndex } from '@/src/views/workout/workouts-index';
import { Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useState } from 'react';

// Create a client component that uses searchParams
const WorkoutsContent = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <>
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button asChild className="hover:cursor-pointer hover:opacity-95 transition-transform duration-200 ease-in-out hover:translate-y-[-1px]">
                            <Link href='/workouts/create'>
                                <Plus />
                                New
                            </Link>
                        </Button>
                        <Button onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="hover:cursor-pointer hover:opacity-95 transition-transform duration-200 ease-in-out hover:translate-y-[-1px]">
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
            <div className="pb-4 relative">
                <GridPattern className="text-primary-900/10" density={20} />
                <h1 className="relative z-10 text-3xl font-display font-bold bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">Workouts</h1>
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