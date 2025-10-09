'use client';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { BarChart3, History, TrendingUp } from 'lucide-react';

import { ExerciseProgress } from './exercise-progress';
import { ExerciseWorkoutHistory } from './exercise-workout-history';

interface ExerciseTabsProps {
  exerciseId: string;
}

export function ExerciseTabs({ exerciseId }: ExerciseTabsProps) {
  const [, setActiveTab] = useState('history');

  return (
    <Card className="border border-border/60 bg-card/95 shadow-card-rest">
      <CardHeader className="space-y-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <TrendingUp className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="type-heading-sm text-foreground">Exercise analytics</CardTitle>
            <CardDescription className="type-body-sm text-muted-foreground">
              Switch between workout history and progress charts to understand how this movement is trending over time.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="history" onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 z-[1] border-b border-border/60 bg-background/95 px-6 py-4 backdrop-blur">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted/60 p-1">
              <TabsTrigger
                value="history"
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                <History className="h-4 w-4" aria-hidden="true" />
                Workout history
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Progress charts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="history" className="px-6 pb-6 pt-4">
            <ExerciseWorkoutHistory exerciseId={exerciseId} />
          </TabsContent>
          <TabsContent value="progress" className="px-6 pb-6 pt-4">
            <ExerciseProgress exerciseId={exerciseId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}