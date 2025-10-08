import { Container } from "@/src/components/common/container";
import { WorkoutChartSection } from "@/src/components/dashboard/workout-chart-section";
import { getDashboard } from "@/src/data/dashboard";
import { Trophy } from "lucide-react";

import { DashboardSummaryHeader } from "./components/summary-header";
import { LatestWorkoutCard } from "./components/latest-workout-card";
import { StatsGrid } from "./components/stats-grid";

export default async function HomePage() {
    const dashboard = await getDashboard();

    if (!dashboard) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
                <Container>
                    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Trophy className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <h1 className="mt-6 type-heading-lg text-foreground">Welcome to your dashboard</h1>
                        <p className="mt-2 max-w-xl type-body-md text-muted-foreground">
                            Log your first workout to unlock personalised summaries, spark lines, and analytics designed to keep you motivated.
                        </p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
            <Container>
                <div className="space-y-10 py-10">
                    <DashboardSummaryHeader dashboard={dashboard} />
                    {dashboard.lastWorkout ? <LatestWorkoutCard workout={dashboard.lastWorkout} /> : null}
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
                        history={dashboard.workoutsByDate ?? []}
                    />
                    <PerformanceAnalytics dashboard={dashboard} />
                </div>
            </Container>
        </div>
    );
}

function PerformanceAnalytics({ dashboard }: { dashboard: NonNullable<Awaited<ReturnType<typeof getDashboard>>> }) {
    return (
        <section className="space-y-6 pb-12">
            <div className="flex flex-col gap-2">
                <p className="type-label text-muted-foreground uppercase tracking-wide">Performance analytics</p>
                <h2 className="type-heading-md text-foreground">Track long-term momentum</h2>
                <p className="max-w-2xl type-body-sm text-muted-foreground">
                    Switch between chart types, presets, and metrics to better understand how your training volume evolves over time.
                </p>
            </div>
            <WorkoutChartSection dashboard={dashboard} />
        </section>
    );
}
