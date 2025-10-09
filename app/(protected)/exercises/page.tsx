"use client";

import { useState } from "react";

import { Container } from "@/src/components/common/container";
import { Button } from "@/src/components/ui/button";
import { ExerciseIndex } from "@/src/views/exercise/exercise-index";
import { Filter, LibraryBig, Plus } from "lucide-react";
import Link from "next/link";

export default function ExercisesPage() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <Container>
        <div className="space-y-10 py-10">
          <header className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <LibraryBig className="h-3.5 w-3.5" aria-hidden="true" />
                  Exercises
                </div>
                <div className="space-y-2">
                  <h1 className="type-heading-lg text-foreground">Explore and organise your exercise library</h1>
                  <p className="max-w-2xl type-body-sm text-muted-foreground">
                    Search, filter, and review every movement in your routine. Persistent filters help you quickly narrow down options without losing your place.
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="hidden shrink-0 shadow-card-rest lg:inline-flex">
                <Link href="/exercises/create">
                  <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Add exercise
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 lg:hidden">
              <Button asChild size="lg" className="flex-1 shadow-card-rest">
                <Link href="/exercises/create">
                  <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Add exercise
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setIsMobileFiltersOpen(open => !open)}
              >
                <Filter className="mr-2 h-5 w-5" aria-hidden="true" />
                {isMobileFiltersOpen ? "Hide filters" : "Show filters"}
              </Button>
            </div>
          </header>

          <ExerciseIndex
            isFilterOpen={isMobileFiltersOpen}
            onFiltersDismiss={() => setIsMobileFiltersOpen(false)}
          />
        </div>
      </Container>
    </div>
  );
}