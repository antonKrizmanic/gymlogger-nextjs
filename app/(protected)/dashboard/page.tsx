import { Container } from "@/src/components/common/container";
import { WorkoutChartSection } from "@/src/components/dashboard/workout-chart-section";
import { Button } from "@/src/components/ui/button";
import { getDashboard } from "@/src/data/dashboard";
import { Plus } from "lucide-react";
import Link from "next/link";
import { LatestWorkoutCard } from "./components/latest-workout-card";
import { StatsGrid } from "./components/stats-grid";

export default async function HomePage() {
    const dashboard = await getDashboard();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            <Container>
                <Hero />

                {dashboard && (
                    <>
                        {dashboard.lastWorkout && <LatestWorkoutCard workout={dashboard.lastWorkout} />}
                        <StatsGrid
                            metrics={{
                                workoutsCount: dashboard.workoutsCount,
                                workoutsThisWeek: dashboard.workoutsThisWeek,
                                workoutsThisMonth: dashboard.workoutsThisMonth,
                                workoutsThisYear: dashboard.workoutsThisYear,
                                seriesThisWeek: dashboard.seriesThisWeek,
                                seriesThisMonth: dashboard.seriesThisMonth,
                                seriesThisYear: dashboard.seriesThisYear,
                                weightThisWeek: dashboard.weightThisWeek,
                                weightThisMonth: dashboard.weightThisMonth,
                                weightThisYear: dashboard.weightThisYear,
                            }}
                        />
                        <PerformanceAnalytics dashboard={dashboard} />
                    </>
                )}
            </Container>
        </div>
    );
}

function Hero() {
    return (
        <div className="space-y-6 pb-8">
            <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                    Welcome back! 💪
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                    Ready to crush your fitness goals today? Let&apos;s track your progress and
                    build on your achievements.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <PrimaryAction />
                <AllWorkoutsLink />
            </div>
        </div>
    );
}

function PrimaryAction() {
    return (
        <Button asChild size="lg" className="px-6 py-3 text-lg font-semibold">
            <Link href="/workouts/create">
                <Plus className="mr-2 h-5 w-5" />
                Start New Workout
            </Link>
        </Button>
    );
}

function AllWorkoutsLink() {
    return (
        <Button asChild variant="outline" size="lg" className="px-6 py-3 text-lg font-semibold">
            <Link href="/workouts">View All Workouts</Link>
        </Button>
    );
}

function PerformanceAnalytics({ dashboard }: { dashboard: NonNullable<Awaited<ReturnType<typeof getDashboard>>> }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
                Performance Analytics
            </h2>
            <WorkoutChartSection dashboard={dashboard} />
        </div>
    );
}
