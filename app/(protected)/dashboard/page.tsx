import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

import { Container } from '@/src/components/common/container';
import { GridPattern } from '@/src/components/common/grid-pattern';
import { StatCounter } from '@/src/components/common/stat-counter';
import { WorkoutCard } from '@/src/components/dashboard/workout-card';
import { WorkoutChartSection } from '@/src/components/dashboard/workout-chart-section';
import { Button } from '@/src/components/ui/button';
import { getDashboard } from '@/src/data/dashboard';
import { Plus } from 'lucide-react';
import Link from 'next/link';


export default async function HomePage() {
    const dashboard = await getDashboard();

    return (
        <Container>
            {!dashboard && (
                <div className="relative overflow-hidden rounded-xl border border-primary-100 dark:border-primary-800 bg-white dark:bg-primary-900 p-8 text-center">
                    <GridPattern className="text-primary-900/10" />
                    <h1 className="relative z-10 text-3xl font-display font-bold text-primary-900 dark:text-primary-100">Welcome to Gym Logger</h1>
                    <p className="relative z-10 mt-2 text-primary-700 dark:text-primary-300">You don't have any workouts yet. Create your first one to get started.</p>
                    <div className="relative z-10 mt-6 flex justify-center">
                        <Button asChild variant="accent" className="hover:translate-y-[-1px] transition-transform">
                            <Link href='/workouts/create'>
                                <Plus />
                                New Workout
                            </Link>
                        </Button>
                    </div>
                </div>
            )}

            {dashboard && (
                <div className="relative overflow-hidden rounded-xl border border-primary-100 dark:border-primary-800 bg-gradient-to-r from-primary-700 to-primary-800 p-6 text-primary-foreground">
                    <GridPattern className="text-primary-900/30" />
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-display font-bold">Welcome back</h1>
                            <p className="text-primary-100">Here’s a quick look at your progress.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center md:text-right">
                            <div>
                                <p className="text-2xl font-bold"><StatCounter value={dashboard.workoutsThisWeek} /></p>
                                <p className="text-primary-100 text-sm">Workouts this week</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold"><StatCounter value={dashboard.seriesThisWeek} /></p>
                                <p className="text-primary-100 text-sm">Sets this week</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold"><StatCounter value={dashboard.weightThisWeek} /></p>
                                <p className="text-primary-100 text-sm">Total weight this week</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {dashboard && (
                <>
                    <div className="grid grid-cols md:grid-cols-4 gap-4 pt-4">
                        {dashboard.lastWorkout && (
                            <WorkoutCard
                                title={dashboard.lastWorkout.name}
                                date={new Date(dashboard.lastWorkout.date).toLocaleDateString()}
                                sets={dashboard.lastWorkout.totalSets}
                                reps={dashboard.lastWorkout.totalReps}
                                weight={dashboard.lastWorkout.totalWeight}
                                muscleGroup={dashboard.lastWorkout.muscleGroupName || "Workout"}
                                viewHref={`/workouts/${dashboard.lastWorkout.id}`}
                                editHref={`/workouts/${dashboard.lastWorkout.id}/edit`}
                            />
                        )}
                        <Card className="bg-white/95 dark:bg-primary-800/90 backdrop-blur">
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

                        <Card className="bg-white/95 dark:bg-primary-800/90 backdrop-blur">
                            <CardHeader>
                                <CardTitle>Sets</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-primary-700 dark:text-primary-300"><b>Sets in this week:</b> {dashboard.seriesThisWeek}</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Sets in this month:</b> {dashboard.seriesThisMonth}</p>
                                <p className="text-primary-700 dark:text-primary-300"><b>Sets in this year:</b> {dashboard.seriesThisYear}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/95 dark:bg-primary-800/90 backdrop-blur">
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
