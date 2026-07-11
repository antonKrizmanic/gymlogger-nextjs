import { Trophy } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import type {
    IPersonalRecord,
    PersonalRecordKind,
} from '@/src/models/domain/performance';

const LABELS: Record<PersonalRecordKind, string> = {
    maxWeight: 'Max weight',
    maxReps: 'Max reps',
    estimatedOneRepMax: 'Estimated 1RM',
    maxTime: 'Max duration',
};

export function PersonalRecords({ records }: { records: IPersonalRecord[] }) {
    if (!records.length) return null;

    return (
        <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Personal records
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {records.map((record) => (
                    <div
                        key={`${record.exerciseId}-${record.kind}`}
                        className="rounded-lg border bg-background/70 p-3"
                    >
                        <p className="font-medium">{record.exerciseName}</p>
                        <p className="text-sm text-muted-foreground">
                            {LABELS[record.kind]}
                        </p>
                        <p className="mt-1 text-xl font-bold text-primary">
                            {record.value} {record.unit}
                        </p>
                        {record.previousValue !== undefined && (
                            <p className="text-xs text-muted-foreground">
                                Previous best: {record.previousValue}{' '}
                                {record.unit}
                            </p>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
