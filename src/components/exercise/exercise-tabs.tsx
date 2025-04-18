'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { ExerciseWorkoutHistory } from './exercise-workout-history';
import { ExerciseProgress } from './exercise-progress';

interface ExerciseTabsProps {
	exerciseId: string;
}

export function ExerciseTabs({ exerciseId }: ExerciseTabsProps) {
	
	const [, setActiveTab] = useState('history');

	return (
		<Tabs defaultValue="history" onValueChange={setActiveTab} className="w-full">
			<TabsList className="grid max-w-[400px] grid-cols-2 mb-4">
				<TabsTrigger value="history" className="text-black data-[state=active]:text-white hover:cursor-pointer">History</TabsTrigger>
				<TabsTrigger value="progress" className="text-black data-[state=active]:text-white hover:cursor-pointer">Progress</TabsTrigger>
			</TabsList>
			
			<TabsContent value="history">
				<ExerciseWorkoutHistory exerciseId={exerciseId} />
			</TabsContent>
			
			<TabsContent value="progress">
				<ExerciseProgress exerciseId={exerciseId} />
			</TabsContent>
		</Tabs>
	);
}