"use client";

import { useId, useMemo, useState } from "react";

import { cn, formatNumber } from "@/src/lib/utils";
import { IDashboard, IDashboardDateItem } from "@/src/models/domain/dashboard";

import { Card } from "@/src/components/ui/card";
import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarCheck,
    LineChart,
    Minus,
    Target,
    Weight,
} from "lucide-react";

type TimeframeKey = "week" | "month" | "year";

const TIMEFRAMES: Record<TimeframeKey, { label: string; description: string; days: number; sparkline: number }> = {
    week: {
        label: "This week",
        description: "Seven-day activity pulse",
        days: 7,
        sparkline: 14,
    },
    month: {
        label: "30 days",
        description: "Momentum over the last month",
        days: 30,
        sparkline: 60,
    },
    year: {
        label: "365 days",
        description: "Macro trend across the year",
        days: 365,
        sparkline: 180,
    },
};

type MetricKey = "workouts" | "series" | "weight";

const METRICS: Array<{
    id: MetricKey;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    suffix?: string;
    keys: Record<TimeframeKey, keyof StatsGridMetrics>;
}> = [
    {
        id: "workouts",
        title: "Workouts",
        subtitle: "Sessions logged",
        icon: <CalendarCheck className="h-4 w-4" aria-hidden="true" />,
        color: "var(--chart-1)",
        keys: {
            week: "workoutsThisWeek",
            month: "workoutsThisMonth",
            year: "workoutsThisYear",
        },
    },
    {
        id: "series",
        title: "Sets",
        subtitle: "Volume drivers",
        icon: <Target className="h-4 w-4" aria-hidden="true" />,
        color: "var(--chart-2)",
        keys: {
            week: "seriesThisWeek",
            month: "seriesThisMonth",
            year: "seriesThisYear",
        },
    },
    {
        id: "weight",
        title: "Load",
        subtitle: "Total kg lifted",
        icon: <Weight className="h-4 w-4" aria-hidden="true" />,
        color: "var(--chart-3)",
        suffix: "kg",
        keys: {
            week: "weightThisWeek",
            month: "weightThisMonth",
            year: "weightThisYear",
        },
    },
];

type StatsGridMetrics = Pick<
    IDashboard,
    | "workoutsCount"
    | "workoutsThisWeek"
    | "workoutsThisMonth"
    | "workoutsThisYear"
    | "seriesThisWeek"
    | "seriesThisMonth"
    | "seriesThisYear"
    | "weightThisWeek"
    | "weightThisMonth"
    | "weightThisYear"
>;

interface StatsGridProps {
    metrics: StatsGridMetrics;
    history?: IDashboardDateItem[];
}

interface DailyHistoryEntry {
    date: Date;
    workouts: number;
    series: number;
    weight: number;
}

export function StatsGrid({ metrics, history = [] }: StatsGridProps) {
    const [timeframe, setTimeframe] = useState<TimeframeKey>("week");

    const aggregatedHistory = useMemo(() => aggregateHistory(history), [history]);

    const cards = useMemo(() => {
        const config = TIMEFRAMES[timeframe];

        return METRICS.map((metric) => {
            const value = metrics[metric.keys[timeframe]] ?? 0;
            const sparklineValues = buildSparklineSeries(aggregatedHistory, metric.id, config.sparkline);
            const { currentTotal, previousTotal } = summarizePeriods(aggregatedHistory, metric.id, config.days);
            const delta = calculateDelta(currentTotal, previousTotal);

            return {
                metric,
                value,
                sparklineValues,
                delta,
            };
        });
    }, [aggregatedHistory, metrics, timeframe]);

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <p className="type-label text-muted-foreground uppercase tracking-wide">Detailed stats</p>
                    <h2 className="type-heading-md text-foreground">Volume and frequency at a glance</h2>
                    <p className="type-body-sm text-muted-foreground">
                        Use the timeframe selector to compare recent momentum and understand how your training cadence evolves.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {(
                        Object.entries(TIMEFRAMES) as Array<[
                            TimeframeKey,
                            { label: string; description: string; days: number; sparkline: number }
                        ]>
                    ).map(([key, config]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setTimeframe(key)}
                            className={cn(
                                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                                timeframe === key
                                    ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                                    : "border-border/70 bg-background text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <LineChart className="h-4 w-4" aria-hidden="true" />
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {cards.map(({ metric, value, sparklineValues, delta }) => (
                    <Card
                        key={metric.id}
                        className="flex h-full flex-col justify-between border border-border/60 bg-card/95 p-6 shadow-card-rest transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"
                    >
                        <header className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-muted"
                                    style={{ color: metric.color }}
                                >
                                    {metric.icon}
                                </span>
                                <div>
                                    <p className="type-body-sm text-muted-foreground">{metric.subtitle}</p>
                                    <h3 className="type-heading-sm text-foreground">{metric.title}</h3>
                                </div>
                            </div>
                            <DeltaBadge delta={delta} />
                        </header>

                        <div className="mt-6 flex items-baseline gap-2">
                            <span className="type-display-sm text-foreground">{formatNumber(value) ?? 0}</span>
                            {metric.suffix ? (
                                <span className="type-body-sm text-muted-foreground">{metric.suffix}</span>
                            ) : null}
                        </div>

                        <div className="mt-6">
                            <Sparkline color={metric.color} values={sparklineValues} />
                            <p className="mt-3 type-body-sm text-muted-foreground">
                                {TIMEFRAMES[timeframe].description}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
}

interface DeltaSummary {
    trend: "up" | "down" | "flat" | "new" | "none";
    value?: number;
}

function calculateDelta(current: number, previous: number): DeltaSummary {
    if (!previous && !current) {
        return { trend: "none" };
    }

    if (!previous && current) {
        return { trend: "new" };
    }

    if (previous === current) {
        return { trend: "flat" };
    }

    const change = ((current - previous) / previous) * 100;
    return { trend: change >= 0 ? "up" : "down", value: Math.abs(change) };
}

function DeltaBadge({ delta }: { delta: DeltaSummary }) {
    if (delta.trend === "none") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground">
                <Minus className="h-3 w-3" aria-hidden="true" />
                No data
            </span>
        );
    }

    if (delta.trend === "new") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                New activity
            </span>
        );
    }

    if (delta.trend === "flat" || delta.value === undefined) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                <Minus className="h-3 w-3" aria-hidden="true" />
                Stable
            </span>
        );
    }

    const isPositive = delta.trend === "up";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
            )}
        >
            {isPositive ? (
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            ) : (
                <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
            )}
            {delta.value.toFixed(1)}%
        </span>
    );
}

function aggregateHistory(history: IDashboardDateItem[]): DailyHistoryEntry[] {
    if (!history?.length) {
        return [];
    }

    const byDay = new Map<string, DailyHistoryEntry>();

    for (const item of history) {
        if (!item?.date) continue;
        const date = new Date(item.date);
        if (Number.isNaN(date.valueOf())) continue;
        const key = date.toISOString().split("T")[0];
        const existing = byDay.get(key) ?? {
            date: new Date(key),
            workouts: 0,
            series: 0,
            weight: 0,
        };

        existing.workouts += 1;
        existing.series += safeNumber(item.series);
        existing.weight += safeNumber(item.weight);

        byDay.set(key, existing);
    }

    return Array.from(byDay.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
}

function summarizePeriods(history: DailyHistoryEntry[], metric: MetricKey, days: number) {
    if (!history.length) {
        return { currentTotal: 0, previousTotal: 0 };
    }

    const today = startOfDay(new Date());
    const currentStart = addDays(today, -(days - 1));
    const previousEnd = addDays(currentStart, -1);
    const previousStart = addDays(previousEnd, -(days - 1));

    let currentTotal = 0;
    let previousTotal = 0;

    for (const entry of history) {
        if (entry.date >= currentStart && entry.date <= today) {
            currentTotal += entry[metric];
        } else if (entry.date >= previousStart && entry.date <= previousEnd) {
            previousTotal += entry[metric];
        }
    }

    return { currentTotal, previousTotal };
}

function buildSparklineSeries(history: DailyHistoryEntry[], metric: MetricKey, windowSize: number) {
    if (!history.length || windowSize <= 0) {
        return [];
    }

    const today = startOfDay(new Date());
    const start = addDays(today, -(windowSize - 1));
    const lookup = new Map(history.map((entry) => [entry.date.toISOString().split("T")[0], entry]));

    const values: number[] = [];
    for (let i = 0; i < windowSize; i++) {
        const current = addDays(start, i);
        const key = current.toISOString().split("T")[0];
        const entry = lookup.get(key);
        values.push(entry ? entry[metric] : 0);
    }

    return values;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
    const id = useId();
    const { path, area, gradientStops } = useMemo(() => buildSparklinePaths(values), [values]);

    if (!values.length) {
        return <div className="h-16 rounded-xl border border-dashed border-border/70" />;
    }

    return (
        <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="h-20 w-full overflow-visible"
            role="img"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={`sparkline-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.24} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#sparkline-${id})`} />
            <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {gradientStops.map((dot, index) => (
                <circle key={index} cx={dot.x} cy={dot.y} r={1.8} fill={color} opacity={0.6} />
            ))}
        </svg>
    );
}

function buildSparklinePaths(values: number[]) {
    if (!values.length) {
        return { path: "", area: "", gradientStops: [] as Array<{ x: number; y: number }> };
    }

    const width = 100;
    const height = 40;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const step = values.length > 1 ? width / (values.length - 1) : width;

    const points = values.map((value, index) => {
        const x = index === values.length - 1 ? width : index * step;
        const normalized = (value - min) / range;
        const y = height - normalized * (height - 8) - 4;
        return { x, y };
    });

    const path = points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
        .join(" ");

    const area = `${path} L ${width} ${height} L 0 ${height} Z`;

    return { path, area, gradientStops: points.filter((_, index) => index % 3 === 0 || index === points.length - 1) };
}

function safeNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "bigint") return Number(value);
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function startOfDay(date: Date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
}

function addDays(date: Date, amount: number) {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
}
