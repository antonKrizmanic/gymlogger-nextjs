'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, TooltipContentProps, XAxis, YAxis } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

type WeightPoint = {
    date: string;
    formattedDate: string;
    weight: number;
};

interface WeightHistoryChartProps {
    data: { createdAt: string | Date; weight: number | string }[];
}

export function WeightHistoryChart({ data }: WeightHistoryChartProps) {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const chartData: WeightPoint[] = (data || []).map((item) => {
        const created = typeof item.createdAt === 'string' ? new Date(item.createdAt) : item.createdAt;
        const weightNumber = typeof item.weight === 'string' ? parseFloat(item.weight) : item.weight;
        return {
            date: format(created, 'yyyy-MM-dd'),
            formattedDate: format(created, 'MMM d'),
            weight: Number(weightNumber)
        };
    });

    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const accentColor = isDarkMode ? '#2dd4bf' : '#14b8a6';
    const accentFill = isDarkMode ? 'rgba(45, 212, 191, 0.22)' : 'rgba(20, 184, 166, 0.18)';
    const accentFillFaded = isDarkMode ? 'rgba(45, 212, 191, 0.04)' : 'rgba(20, 184, 166, 0.04)';
    const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.18)' : 'rgba(15, 23, 42, 0.08)';
    const axisColor = isDarkMode ? 'rgba(203, 213, 225, 0.85)' : 'rgba(71, 81, 102, 0.85)';

    if (!chartData.length) {
        return (
            <Card className="h-full">
                <CardHeader className="pb-4">
                    <CardTitle>Weight history</CardTitle>
                    <CardDescription>Log a measurement to unlock your progress chart.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 text-center">
                        <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">No entries yet</div>
                        <p className="type-body-sm text-muted-foreground">
                            Add your current weight from the profile editor to begin tracking trends over time.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const lastEntry = chartData[chartData.length - 1];
    const lastUpdatedLabel = lastEntry ? lastEntry.formattedDate : '';

    const CustomTooltip = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const rawValue = Number(payload[0].value as number);
            const formattedValue = Number.isFinite(rawValue) ? rawValue.toFixed(2) : (payload[0].value as string);
            return (
                <div className="rounded-xl border border-border bg-card/95 p-4 shadow-card-hover">
                    <p className="type-label text-muted-foreground">{label}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: payload[0].color as string }} />
                        <span className="type-body-sm text-muted-foreground">Weight</span>
                        <span className="type-body-sm font-semibold text-foreground">{formattedValue} kg</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full">
            <CardHeader className="gap-1 pb-4">
                <CardTitle>Weight history</CardTitle>
                <CardDescription>
                    {`Latest log ${lastUpdatedLabel ? `on ${lastUpdatedLabel}` : 'pending your first entry'}.`}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="mt-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 28, left: 12, bottom: 20 }}>
                            <defs>
                                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.45} />
                                    <stop offset="55%" stopColor={accentFill} stopOpacity={0.35} />
                                    <stop offset="100%" stopColor={accentFillFaded} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke={gridColor} />
                            <XAxis dataKey="formattedDate" stroke={axisColor} tickLine={false} axisLine={false} fontSize={12} fontWeight={500} />
                            <YAxis stroke={axisColor} tickLine={false} axisLine={false} fontSize={12} fontWeight={500} width={50} />
                            <Tooltip cursor={{ stroke: accentColor, strokeWidth: 1, strokeDasharray: '3 3' }} content={CustomTooltip} />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke={accentColor}
                                strokeWidth={2.5}
                                fill="url(#weightGradient)"
                                activeDot={{
                                    r: 6,
                                    fill: accentColor,
                                    stroke: isDarkMode ? '#0f172a' : '#ffffff',
                                    strokeWidth: 2,
                                }}
                                dot={{
                                    r: 4,
                                    fill: accentColor,
                                    stroke: isDarkMode ? '#0f172a' : '#ffffff',
                                    strokeWidth: 1.5,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}


