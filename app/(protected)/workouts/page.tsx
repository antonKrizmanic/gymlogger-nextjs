"use client";

import { useState } from "react";

import { Container } from "@/src/components/common/container";
import { Button } from "@/src/components/ui/button";
import { WorkoutsIndex } from "@/src/views/workout/workouts-index";
import { Filter, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function WorkoutsPage() {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
            <Container>
                <div className="space-y-10 py-10">
                    <header className="space-y-6">
                        <div className="flex items-start justify-between gap-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                                    Workouts
                                </div>
                                <div className="space-y-2">
                                    <h1 className="type-heading-lg text-foreground">Plan and review your training log</h1>
                                    <p className="max-w-2xl type-body-sm text-muted-foreground">
                                        Surface the exact sessions you need by combining search, focus areas, and dates. Every filter updates instantly so you can stay focused on the next workout.
                                    </p>
                                </div>
                            </div>
                            <Button asChild size="lg" className="hidden shrink-0 shadow-card-rest lg:inline-flex">
                                <Link href="/workouts/create">
                                    <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                                    Log workout
                                </Link>
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3 lg:hidden">
                            <Button asChild size="lg" className="flex-1 shadow-card-rest">
                                <Link href="/workouts/create">
                                    <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                                    Log workout
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                onClick={() => setIsMobileFiltersOpen((open) => !open)}
                            >
                                <Filter className="mr-2 h-5 w-5" aria-hidden="true" />
                                {isMobileFiltersOpen ? "Hide filters" : "Show filters"}
                            </Button>
                        </div>
                    </header>

                    <WorkoutsIndex
                        isFilterOpen={isMobileFiltersOpen}
                        onFiltersDismiss={() => setIsMobileFiltersOpen(false)}
                    />
                </div>
            </Container>
        </div>
    );
}