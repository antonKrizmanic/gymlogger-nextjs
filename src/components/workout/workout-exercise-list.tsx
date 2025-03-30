import { IExerciseWorkout } from '@/src/models/domain/workout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ExerciseSets } from './exercise-sets';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

interface WorkoutExerciseListProps {
    exercises: IExerciseWorkout[];
}

export function WorkoutExerciseList({ exercises }: WorkoutExerciseListProps) {
    return (
        <div className="space-y-4">
            {exercises.map((exercise) => (
                <Card key={exercise.exerciseId}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl">{exercise.exerciseName || 'Untitled Exercise'}</CardTitle>                            
                                {exercise.exerciseDescription && (
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                                        {exercise.exerciseDescription}
                                    </CardDescription>
                                )}
							</div>
							<Button asChild variant="outline" className="ml-auto">
								<Link href={`/exercises/${exercise.exerciseId}`}>
									View Exercise <ArrowRightIcon className="h-4 w-4 ml-2" />
								</Link>
							</Button>
						</div>
                    </CardHeader>
                    <CardContent>                        
                        <div className="overflow-x-auto">
                            <ExerciseSets exercise={exercise} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 