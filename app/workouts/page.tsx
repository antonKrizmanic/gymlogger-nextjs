import { WorkoutService } from '@/src/Api/Services/WorkoutService';
import { WorkoutsIndex } from '@/views/workout/WorkoutsIndex';

export default async function WorkoutsPage(
  props: {
    searchParams: Promise<Record<string, string>>;
  }
) {
  const searchParams = await props.searchParams;
  
  // Construct URLSearchParams object from searchParams
  const params = new URLSearchParams(
    Object.entries(searchParams)
      .flatMap(([key, value]) =>
        Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value ?? ""]]
      )
  );  
  
  const workoutService = new WorkoutService();
  const { items: workouts, pagingData } = await workoutService.getWorkouts(params);  

  if(workouts === undefined) {
    return <div>Loading...</div>;
  }
  
  return (
    <WorkoutsIndex
      workouts={workouts}
      currentPage={pagingData.page}
      pageSize={pagingData.pageSize}
      totalPages={pagingData.totalPages} />    
  );
}