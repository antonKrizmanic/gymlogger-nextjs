"use client";
import { Container } from '@/src/components/common/container';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ExerciseIndex } from '@/src/views/exercise/exercise-index';
import { Activity, Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense, useState } from 'react';

// Create a client component that contains the ExerciseIndex with useSearchParams
const ExerciseContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Listen for the toggle filter event
  React.useEffect(() => {
    const handleToggleFilter = () => {
      setIsFilterOpen(prev => !prev);
    };

    window.addEventListener('toggleExerciseFilter', handleToggleFilter);
    return () => window.removeEventListener('toggleExerciseFilter', handleToggleFilter);
  }, []);

  return (
    <ExerciseIndex isFilterOpen={isFilterOpen} />
  );
};

export default function ExercisesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <Container>
        {/* Hero Section */}
        <div className="space-y-6 pb-8">
          <div className="space-y-4">
            <h1 className="type-display-sm lg:type-display-md text-foreground flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              Exercise Library
            </h1>
            <p className="type-body-lg text-muted-foreground max-w-2xl">
              Discover and master new exercises. Build your perfect workout routine with
              our comprehensive exercise database and tracking tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="px-6 py-3 text-lg font-semibold">
              <Link href="/exercises/create">
                <Plus className="mr-2 h-5 w-5" />
                Add Exercise
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-6 py-3 text-lg font-semibold"
              onClick={() => {
                const event = new CustomEvent('toggleExerciseFilter');
                window.dispatchEvent(event);
              }}
            >
              <Filter className="mr-2 h-5 w-5" />
              Filter & Search
            </Button>
          </div>
        </div>

        {/* Exercises List */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="h-6 w-6 text-primary" />
              All Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }>
              <ExerciseContent />
            </Suspense>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}