import { ActionButton } from '@/src/components/Common/ActionButton';
import { Card } from '@/src/components/Common/Card';
import { PlusIcon } from '@/src/components/Icons';
import { Container } from '@/src/components/Common/Container';
import { WorkoutChartSection } from '@/src/components/Dashboard/WorkoutChartSection';
import { DetailButton } from '@/src/components/Common/DetailButton';
import { EditButton } from '@/src/components/Common/EditButton';
import { getDashboard } from '@/src/data/dashboard';


export default async function HomePage() {    
    const dashboard = await getDashboard();    

    return (
        <Container>            
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to GymLogger</h1>
                <p className="text-lg text-gray-600">                    
                    Track your workouts and progress with ease.
                </p>                    
                <ActionButton href="/workouts/create" className="w-fit">
                    <PlusIcon />
                    New Workout
                </ActionButton>                
            </div>
            {dashboard && (
                <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {dashboard.lastWorkout && (
                        <Card>
                            <h3 className="text-lg font-bold text-gray-600 dark:text-white">Last workout</h3>
                            <h4 className="text-md font-bold text-gray-600 dark:text-white">{dashboard.lastWorkout.name}</h4>
                            <p className="text-sm text-gray-400"><b>Date:</b> {new Date(dashboard.lastWorkout.date).toLocaleDateString()}</p>                        
                            <p className="text-sm text-gray-400"><b>Total sets:</b> {dashboard.lastWorkout.totalSets}</p>
                            <p className="text-sm text-gray-400"><b>Total reps:</b> {dashboard.lastWorkout.totalReps}</p>
                            <p className="text-sm text-gray-400"><b>Total weights:</b> {dashboard.lastWorkout.totalWeight} kg</p>

                            <div className="mt-auto flex justify-between items-center px-0">
                                <DetailButton href={`/workouts/${dashboard.lastWorkout.id}`} />
                                <EditButton href={`/workouts/${dashboard.lastWorkout.id}/edit`} />                                    
                            </div>
                        </Card>
                    )}
                    <Card>
                        <h3 className="text-lg font-bold text-gray-600 dark:text-white">Workouts</h3>
                        <p className="text-sm text-gray-400"><b>Workouts recorded in app:</b> {dashboard.workoutsCount}</p>
                        <p className="text-sm text-gray-400"><b>Workouts in this week:</b> {dashboard.workoutsThisWeek}</p>
                        <p className="text-sm text-gray-400"><b>Workouts in this month:</b> {dashboard.workoutsThisMonth}</p>
                        <p className="text-sm text-gray-400"><b>Workouts in this year:</b> {dashboard.workoutsThisYear}</p>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-gray-600 dark:text-white">Sets</h3>
                        <p className="text-sm text-gray-400"><b>Sets in this week:</b> {dashboard.seriesThisWeek}</p>
                        <p className="text-sm text-gray-400"><b>Sets in this month:</b> {dashboard.seriesThisMonth}</p>
                        <p className="text-sm text-gray-400"><b>Sets in this year:</b> {dashboard.seriesThisYear}</p>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-gray-600 dark:text-white">Weights</h3>
                        <p className="text-sm text-gray-400"><b>Weights in this week:</b> {dashboard.weightThisWeek} kg</p>
                        <p className="text-sm text-gray-400"><b>Weights in this month:</b> {dashboard.weightThisMonth} kg</p>
                        <p className="text-sm text-gray-400"><b>Weights in this year:</b> {dashboard.weightThisYear} kg</p>
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
