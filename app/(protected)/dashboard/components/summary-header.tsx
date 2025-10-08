"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatNumber } from "@/src/lib/utils";
import { IDashboard } from "@/src/models/domain/dashboard";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { CalendarDays, Dumbbell, Filter, Target, TrendingUp } from "lucide-react";

type TimeframeKey = "week" | "month" | "year";

const TIMEFRAMES: Array<{
    id: TimeframeKey;
    label: string;
    description: string;
}> = [
    {
        id: "week",
        label: "This Week",
        description: "Focus on near-term consistency",
    },
    {
        id: "month",
        label: "This Month",
        description: "Zoom out to spot momentum shifts",
    },
    {
        id: "year",
        label: "This Year",
        description: "Celebrate the big picture wins",
    },
];

const SUMMARY_METRICS = [
    {
        id: "workouts" as const,
        label: "Workouts logged",
        icon: <CalendarDays className="h-4 w-4" aria-hidden="true" />,
        keys: {
            week: "workoutsThisWeek" as const,
            month: "workoutsThisMonth" as const,
            year: "workoutsThisYear" as const,
        },
    },
    {
        id: "series" as const,
        label: "Total sets",
        icon: <Target className="h-4 w-4" aria-hidden="true" />,
        keys: {
            week: "seriesThisWeek" as const,
            month: "seriesThisMonth" as const,
            year: "seriesThisYear" as const,
        },
    },
    {
        id: "weight" as const,
        label: "Volume lifted",
        icon: <Dumbbell className="h-4 w-4" aria-hidden="true" />,
        keys: {
            week: "weightThisWeek" as const,
            month: "weightThisMonth" as const,
            year: "weightThisYear" as const,
        },
        suffix: "kg",
    },
];

interface DashboardSummaryHeaderProps {
    dashboard: IDashboard;
}

export function DashboardSummaryHeader({ dashboard }: DashboardSummaryHeaderProps) {
    const [timeframe, setTimeframe] = useState<TimeframeKey>("week");

    const summary = useMemo(
        () =>
            SUMMARY_METRICS.map((metric) => {
                const rawValue = dashboard[metric.keys[timeframe]];
                return {
                    id: metric.id,
                    label: metric.label,
                    icon: metric.icon,
                    value: formatNumber(rawValue) ?? "0",
                    suffix: metric.suffix,
                };
            }),
        [dashboard, timeframe],
    );

    return (
        <section className="rounded-3xl bg-card shadow-card-rest ring-1 ring-border/60 px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-6">
                    <div className="space-y-3">
                        <p className="type-label text-muted-foreground uppercase tracking-wide">Dashboard</p>
                        <h1 className="type-heading-lg text-foreground">
                            Welcome back! Ready to build on yesterday&apos;s progress?
                        </h1>
                        <p className="type-body-md text-muted-foreground">
                            Your activity summary updates live with every logged workout. Use the filters to focus on the
                            timeframe that matters most today.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild size="lg">
                            <Link href="/workouts/create">Start new workout</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/workouts">View all workouts</Link>
                        </Button>
                        {dashboard.favoriteMuscleGroupName ? (
                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-medium">
                                Focused on {dashboard.favoriteMuscleGroupName}
                            </Badge>
                        ) : null}
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="type-label text-muted-foreground uppercase tracking-wide">Quick stats</p>
                            <p className="type-body-sm text-muted-foreground">
                                Total workouts logged: <span className="font-semibold text-foreground">{formatNumber(dashboard.workoutsCount)}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <div className="flex gap-2 rounded-full bg-muted/60 p-1">
                                {TIMEFRAMES.map((option) => (
                                    <Button
                                        key={option.id}
                                        size="sm"
                                        variant={timeframe === option.id ? "secondary" : "ghost"}
                                        className={
                                            timeframe === option.id
                                                ? "rounded-full px-4"
                                                : "rounded-full px-4 text-muted-foreground hover:text-foreground"
                                        }
                                        onClick={() => setTimeframe(option.id)}
                                        type="button"
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {summary.map((metric) => (
                            <div
                                key={metric.id}
                                className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-muted/30 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                            >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="inline-flex size-8 items-center justify-center rounded-xl bg-card shadow-sm">
                                        {metric.icon}
                                    </span>
                                    <span className="type-body-sm font-medium">{metric.label}</span>
                                </div>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="type-heading-md text-foreground">{metric.value}</span>
                                    {metric.suffix ? (
                                        <span className="type-body-sm text-muted-foreground">{metric.suffix}</span>
                                    ) : null}
                                </div>
                                <p className="mt-2 type-body-sm text-muted-foreground/80">
                                    {TIMEFRAMES.find((item) => item.id === timeframe)?.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-dashed border-border/80 bg-background/70 p-4">
                        <div className="space-y-1">
                            <p className="type-body-sm font-medium text-foreground">Need a deeper dive?</p>
                            <p className="type-body-sm text-muted-foreground">
                                Explore the analytics below for spark lines, volume deltas, and personalised trends.
                            </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>
    );
}
