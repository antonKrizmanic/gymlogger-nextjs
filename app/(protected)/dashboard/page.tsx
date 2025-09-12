import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';

import { Container } from '@/src/components/common/container';
import { DetailButton } from '@/src/components/common/detail-button';
import { EditButton } from '@/src/components/common/edit-button';
import { WorkoutChartSection } from '@/src/components/dashboard/workout-chart-section';
import { Button } from '@/src/components/ui/button';
import { getDashboard } from '@/src/data/dashboard';
import { Plus } from 'lucide-react';
import Link from 'next/link';


export default async function HomePage() {
    const dashboard = await getDashboard();

    return (
        <Container>
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100">Welcome to Gym Logger</h1>
                <p className="text-lg text-primary-700 dark:text-primary-300">
                    Track your workouts and progress with ease.
                </p>
                <Button asChild className="w-fit" variant="accent">
                    <Link href='/workouts/create'>
                        <Plus />
                        New Workout
                    </Link>
                </Button>
            </div>

            {dashboard && (
                <>
                    <div className="grid grid-cols md:grid-cols-4 gap-4 pt-4">
                        {dashboard.lastWorkout && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Last workout</CardTitle>
                                    <CardDescription>{dashboard.lastWorkout.name}</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-primary-700 dark:text-primary-300"><b>Date:</b> {new Date(dashboard.lastWorkout.date).toLocaleDateString()}</p>
                                    <p className="text-primary-700 dark:text-primary-300"><b>Total sets:</b> {dashboard.lastWorkout.totalSets}</p>
                                    <p className="text-primary-700 dark:text-primary-300"><b>Total reps:</b> {dashboard.lastWorkout.totalReps}</p>
                                    <p className="text-primary-700 dark:text-primary-300"><b>Total weights:</b> {dashboard.lastWorkout.totalWeight} kg</p>
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
                                <p className="text-primary-700 dark:text-primary-300"><b>Workouts recorded in app:</b> {dashboard.workoutsCount}</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Workouts in this week:</b> {dashboard.workoutsThisWeek}</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Workouts in this month:</b> {dashboard.workoutsThisMonth}</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Workouts in this year:</b> {dashboard.workoutsThisYear}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sets</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-primary-700 dark:text-primary-300"><b>Sets in this week:</b> {dashboard.seriesThisWeek}</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Sets in this month:</b> {dashboard.seriesThisMonth}</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Sets in this year:</b> {dashboard.seriesThisYear}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Weights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-primary-700 dark:text-primary-300"><b>Weights in this week:</b> {dashboard.weightThisWeek} kg</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Weights in this month:</b> {dashboard.weightThisMonth} kg</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Weights in this year:</b> {dashboard.weightThisYear} kg</p>
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
