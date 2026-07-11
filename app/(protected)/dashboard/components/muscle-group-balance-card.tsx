import { Scale } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import type { IMuscleGroupBalance } from '@/src/models/domain/dashboard';

export function MuscleGroupBalanceCard({
    items,
}: {
    items: IMuscleGroupBalance[];
}) {
    if (!items.length) return null;

    const maxSets = Math.max(1, ...items.map((item) => item.currentWeekSets));

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Weekly training distribution
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Logged sets by primary muscle group, compared with your
                    previous four-week average.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => (
                    <div key={item.muscleGroupId} className="space-y-1">
                        <div className="flex justify-between gap-4 text-sm">
                            <span className="font-medium">
                                {item.muscleGroupName}
                            </span>
                            <span className="text-muted-foreground">
                                {item.currentWeekSets} sets · avg{' '}
                                {item.previousFourWeekAverage.toFixed(1)}
                                {item.changePercent !== undefined
                                    ? ` · ${item.changePercent > 0 ? '+' : ''}${item.changePercent}%`
                                    : ''}
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                    width: `${(item.currentWeekSets / maxSets) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
