'use client';

import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    type TooltipContentProps,
    XAxis,
    YAxis,
} from 'recharts';
import type {
    NameType,
    ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';

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
        const created =
            typeof item.createdAt === 'string'
                ? new Date(item.createdAt)
                : item.createdAt;
        const weightNumber =
            typeof item.weight === 'string'
                ? parseFloat(item.weight)
                : item.weight;
        return {
            date: format(created, 'yyyy-MM-dd'),
            formattedDate: format(created, 'MMM d'),
            weight: Number(weightNumber),
        };
    });

    if (!chartData.length) {
        return (
            <Card className="border-2 shadow-xl h-full">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                        <span>Weight History</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground">
                        No weight entries yet.
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Custom tooltip styled like dashboard charts
    const CustomTooltip = ({
        active,
        payload,
        label,
    }: TooltipContentProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const rawValue = Number(payload[0].value as number);
            const formattedValue = Number.isFinite(rawValue)
                ? rawValue.toFixed(2)
                : (payload[0].value as string);
            return (
                <div className="bg-card border border-border shadow-xl rounded-lg p-4">
                    <p className="font-semibold text-muted-foreground mb-2">
                        {label}
                    </p>
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: payload[0].color as string,
                            }}
                        />
                        <span className="text-sm text-muted-foreground">
                            Weight:
                        </span>
                        <span className="text-sm font-bold text-muted-foreground">
                            {formattedValue} kg
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="border-2 shadow-xl h-full">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                    <span>Weight History</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="weightGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={
                                            isDarkMode ? '#22d3ee' : '#0ea5e9'
                                        }
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={
                                            isDarkMode ? '#22d3ee' : '#0ea5e9'
                                        }
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={isDarkMode ? '#334155' : '#e2e8f0'}
                            />
                            <XAxis
                                dataKey="formattedDate"
                                stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                                fontSize={12}
                                fontWeight={500}
                            />
                            <YAxis
                                stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                                fontSize={12}
                                fontWeight={500}
                            />
                            <Tooltip content={CustomTooltip} />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke={isDarkMode ? '#22d3ee' : '#0ea5e9'}
                                strokeWidth={3}
                                fill="url(#weightGradient)"
                                activeDot={{
                                    r: 6,
                                    fill: isDarkMode ? '#22d3ee' : '#0ea5e9',
                                    stroke: isDarkMode ? '#1a1f29' : '#ffffff',
                                    strokeWidth: 2,
                                }}
                                dot={{
                                    r: 4,
                                    fill: isDarkMode ? '#22d3ee' : '#0ea5e9',
                                    stroke: isDarkMode ? '#1a1f29' : '#ffffff',
                                    strokeWidth: 1,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
