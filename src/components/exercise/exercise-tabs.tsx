'use client';

import { BarChart3, History } from 'lucide-react';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/src/components/ui/tabs';
import { ExerciseProgress } from './exercise-progress';
import { ExerciseWorkoutHistory } from './exercise-workout-history';

interface ExerciseTabsProps {
    exerciseId: string;
}

export function ExerciseTabs({ exerciseId }: ExerciseTabsProps) {
    const [, setActiveTab] = useState('history');

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center">
                    <BarChart3 className="mr-2 h-6 w-6 text-primary" />
                    Exercise Analytics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs
                    defaultValue="history"
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                        <TabsTrigger
                            value="history"
                            className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <History className="h-4 w-4" />
                            Workout History
                        </TabsTrigger>
                        <TabsTrigger
                            value="progress"
                            className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Progress Charts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="history" className="mt-0">
                        <ExerciseWorkoutHistory exerciseId={exerciseId} />
                    </TabsContent>

                    <TabsContent value="progress" className="mt-0">
                        <ExerciseProgress exerciseId={exerciseId} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
