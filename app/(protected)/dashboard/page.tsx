import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';

import { Container } from '@/src/components/common/container';
import { DetailButton } from '@/src/components/common/detail-button';
import { EditButton } from '@/src/components/common/edit-button';
import { WorkoutChartSection } from '@/src/components/dashboard/workout-chart-section';
import { Button } from '@/src/components/ui/button';
import { getDashboard } from '@/src/data/dashboard';
import {
    BarChart3,
    Calendar,
    Clock,
    Dumbbell,
    Plus,
    Target,
    TrendingUp,
    Trophy
} from 'lucide-react';
import Link from 'next/link';


export default async function HomePage() {
    const dashboard = await getDashboard();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            <Container>
                {/* Hero Section */}
                <div className="space-y-6 pb-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                            Welcome back! 💪
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                            Ready to crush your fitness goals today? Let&apos;s track your progress and
                            build on your achievements.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" className="px-6 py-3 text-lg font-semibold">
                            <Link href='/workouts/create'>
                                <Plus className="mr-2 h-5 w-5" />
                                Start New Workout
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="px-6 py-3 text-lg font-semibold">
                            <Link href='/workouts'>
                                <Calendar className="mr-2 h-5 w-5" />
                                View All Workouts
                            </Link>
                        </Button>
                    </div>
                </div>

                {dashboard && (
                    <>
                        {/* Last Workout Highlight */}
                        {dashboard.lastWorkout && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                    <Trophy className="mr-2 h-6 w-6 text-primary" />
                                    Latest Achievement
                                </h2>
                                <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl font-bold text-foreground">
                                                    {dashboard.lastWorkout.name}
                                                </CardTitle>
                                                <CardDescription className="text-muted-foreground flex items-center mt-2">
                                                    <Clock className="mr-1 h-4 w-4" />
                                                    {new Date(dashboard.lastWorkout.date).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <Dumbbell className="h-8 w-8 text-primary" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-4">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="bg-background/50 rounded-lg p-3">
                                                <p className="text-2xl font-bold text-primary">{dashboard.lastWorkout.totalSets}</p>
                                                <p className="text-sm text-muted-foreground">Sets</p>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3">
                                                <p className="text-2xl font-bold text-primary">{dashboard.lastWorkout.totalReps}</p>
                                                <p className="text-sm text-muted-foreground">Reps</p>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3">
                                                <p className="text-2xl font-bold text-primary">{dashboard.lastWorkout.totalWeight}</p>
                                                <p className="text-sm text-muted-foreground">kg Total</p>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex gap-3 pt-0">
                                        <div className="flex-1">
                                            <DetailButton href={`/workouts/${dashboard.lastWorkout.id}`} />
                                        </div>
                                        <div className="flex-1">
                                            <EditButton href={`/workouts/${dashboard.lastWorkout.id}/edit`} />
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="space-y-6 mb-8">
                            <h2 className="text-2xl font-bold text-foreground flex items-center">
                                <BarChart3 className="mr-2 h-6 w-6 text-primary" />
                                Your Progress
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                {/* Workouts Card */}
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-3 bg-primary/10 rounded-xl">
                                                    <Calendar className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold">Workouts</CardTitle>
                                                    <p className="text-xs text-muted-foreground">Training sessions</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-primary">
                                                    {dashboard.workoutsCount}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Total</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold">This Week</span>
                                                    <span className="text-lg font-bold">{dashboard.workoutsThisWeek}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">This Month</span>
                                                    <span className="text-base font-semibold">{dashboard.workoutsThisMonth}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">This Year</span>
                                                    <span className="text-base font-semibold">{dashboard.workoutsThisYear}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Sets Card */}
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-3 bg-primary/10 rounded-xl">
                                                    <Target className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold">Training Sets</CardTitle>
                                                    <p className="text-xs text-muted-foreground">Exercise sets</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-primary">
                                                    {dashboard.seriesThisWeek}
                                                </div>
                                                <p className="text-xs text-muted-foreground">This week</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold">This Week</span>
                                                    <span className="text-lg font-bold">{dashboard.seriesThisWeek}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">This Month</span>
                                                    <span className="text-base font-semibold">{dashboard.seriesThisMonth}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">This Year</span>
                                                    <span className="text-base font-semibold">{dashboard.seriesThisYear}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Weight Card */}
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-card to-card/80">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-3 bg-primary/10 rounded-xl">
                                                    <TrendingUp className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold">Total Weight</CardTitle>
                                                    <p className="text-xs text-muted-foreground">Weight lifted</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">
                                                    {dashboard.weightThisWeek}
                                                    <span className="text-sm font-normal ml-1">kg</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">This week</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold">This Week</span>
                                                    <span className="text-lg font-bold">{dashboard.weightThisWeek} kg</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">This Month</span>
                                                    <span className="text-base font-semibold">{dashboard.weightThisMonth} kg</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">This Year</span>
                                                    <span className="text-base font-semibold">{dashboard.weightThisYear} kg</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-foreground flex items-center">
                                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                                Performance Analytics
                            </h2>
                            <WorkoutChartSection dashboard={dashboard} />
                        </div>
                    </>
                )}

            </Container>
        </div>
    );
}
