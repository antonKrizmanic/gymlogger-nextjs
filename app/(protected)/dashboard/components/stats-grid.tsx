import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { formatNumber } from "@/src/lib/utils";
import { IDashboard } from "@/src/models/domain/dashboard";
import { BarChart3, Calendar, Target, TrendingUp } from "lucide-react";

interface StatsGridProps {
    metrics: Pick<
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
}

export function StatsGrid({ metrics }: StatsGridProps) {
    return (
        <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center">
                <BarChart3 className="mr-2 h-6 w-6 text-primary" />
                Your Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <StatCard
                    icon={<Calendar className="h-6 w-6 text-primary" />}
                    title="Workouts"
                    subtitle="Training sessions"
                    total={metrics.workoutsCount}
                    weekly={metrics.workoutsThisWeek}
                    monthly={metrics.workoutsThisMonth}
                    yearly={metrics.workoutsThisYear}
                />

                <StatCard
                    icon={<Target className="h-6 w-6 text-primary" />}
                    title="Training Sets"
                    subtitle="Exercise sets"
                    total={metrics.seriesThisWeek}
                    weekly={metrics.seriesThisWeek}
                    monthly={metrics.seriesThisMonth}
                    yearly={metrics.seriesThisYear}
                />

                <StatCard
                    icon={<TrendingUp className="h-6 w-6 text-primary" />}
                    title="Total Weight"
                    subtitle="Weight lifted"
                    total={metrics.weightThisWeek}
                    weekly={metrics.weightThisWeek}
                    monthly={metrics.weightThisMonth}
                    yearly={metrics.weightThisYear}
                    suffix=" kg"
                />
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    total?: number | null;
    weekly?: number | null;
    monthly?: number | null;
    yearly?: number | null;
    suffix?: string;
}

function StatCard({ icon, title, subtitle, weekly, monthly, yearly, suffix = "" }: StatCardProps) {
    return (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-primary/10 rounded-xl">{icon}</div>
                        <div>
                            <CardTitle className="text-lg font-bold">{title}</CardTitle>
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    <StatMetric label="This Week" value={weekly} suffix={suffix} bold />
                    <StatMetric label="This Month" value={monthly} suffix={suffix} />
                    <StatMetric label="This Year" value={yearly} suffix={suffix} />
                </div>
            </CardContent>
        </Card>
    );
}

interface StatMetricProps {
    label: string;
    value?: number | null;
    suffix?: string;
    bold?: boolean;
}

function StatMetric({ label, value, suffix = "", bold = false }: StatMetricProps) {
    const valueClassName = bold ? "text-lg font-bold" : "text-base font-semibold";

    return (
        <div className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
            <span className={`text-sm ${bold ? "font-bold" : "text-muted-foreground"}`}>{label}</span>
            <span className={`${valueClassName}`}>
                {formatNumber(value)}
                {suffix}
            </span>
        </div>
    );
}
