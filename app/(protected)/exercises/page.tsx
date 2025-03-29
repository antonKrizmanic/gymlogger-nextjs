"use client";
import { ExerciseIndex } from '@/src/views/exercise/exercise-index';
import { useState } from 'react';
import { Container } from '@/src/components/common/container';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { Filter, Plus } from 'lucide-react';

export default function ExercisesPage() {  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <Container>
      <div className="pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Exercises</h1>
      </div>
      {/* Top controls */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button asChild className="hover:cursor-pointer hover:opacity-95 transition-opacity duration-200 ease-in-out">
              <Link href="/exercises/create">
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
      <ExerciseIndex 
        isFilterOpen={isFilterOpen}
      />
    </Container>
  );
}