import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';

import { Container } from '@/src/components/Common/Container';
import { WorkoutChartSection } from '@/src/components/Dashboard/WorkoutChartSection';
import { DetailButton } from '@/src/components/Common/DetailButton';
import { EditButton } from '@/src/components/Common/EditButton';
import { getDashboard } from '@/src/data/dashboard';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';


export default async function HomePage() {
    const dashboard = await getDashboard();

    return (
        <Container>
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to GymLogger</h1>
                <p className="text-lg text-gray-600">
                    Track your workouts and progress with ease.
                </p>
                <Button asChild className="w-fit">
                    <Link href='/workouts/create'>
                        <Plus />
                        New Workout
                    </Link>
                </Button>
            </div>

            {dashboard && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        {dashboard.lastWorkout && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Last workout</CardTitle>
                                    <CardDescription>{dashboard.lastWorkout.name}</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <p><b>Date:</b> {new Date(dashboard.lastWorkout.date).toLocaleDateString()}</p>
                                    <p><b>Total sets:</b> {dashboard.lastWorkout.totalSets}</p>
                                    <p><b>Total reps:</b> {dashboard.lastWorkout.totalReps}</p>
                                    <p><b>Total weights:</b> {dashboard.lastWorkout.totalWeight} kg</p>
                                </CardContent>

                                <CardFooter className="flex justify-between gap-2">
                                    <div className="w-1/2">
                                        <DetailButton href={`/workouts/${dashboard.lastWorkout.id}`} />
                                    </div>
                                    <div className="w-1/2">
                                        <EditButton href={`/workouts/${dashboard.lastWorkout.id}/edit`} />
                                    </div>
                                    
                                    
                                </CardFooter>
                            </Card>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle>Workouts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><b>Workouts recorded in app:</b> {dashboard.workoutsCount}</p>
                                <p><b>Workouts in this week:</b> {dashboard.workoutsThisWeek}</p>
                                <p><b>Workouts in this month:</b> {dashboard.workoutsThisMonth}</p>
                                <p><b>Workouts in this year:</b> {dashboard.workoutsThisYear}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sets</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><b>Sets in this week:</b> {dashboard.seriesThisWeek}</p>
                                <p><b>Sets in this month:</b> {dashboard.seriesThisMonth}</p>
                                <p><b>Sets in this year:</b> {dashboard.seriesThisYear}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Wwights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><b>Weights in this week:</b> {dashboard.weightThisWeek} kg</p>
                                <p><b>Weights in this month:</b> {dashboard.weightThisMonth} kg</p>
                                <p><b>Weights in this year:</b> {dashboard.weightThisYear} kg</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6">
                        <WorkoutChartSection dashboard={dashboard} />
                    </div>
                </>
            )}

        </Container>
    );
}
