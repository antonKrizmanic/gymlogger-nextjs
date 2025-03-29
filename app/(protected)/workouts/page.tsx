import { getPagedWorkouts, IWorkoutRequest } from '@/src/data/workout';
import { SortDirection } from '@/src/types/enums';
import { WorkoutsIndex } from '@/src/views/workout/workoutsindex';

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
  
  const pagedRequest: IWorkoutRequest = {
    page: parseInt(params.get('page') ?? '0'),
    pageSize: parseInt(params.get('pageSize') ?? '12'),
    search: params.get('search') ?? '',
    sortColumn: params.get('sortColumn') ?? '',
    sortDirection: params.get('sortDirection') as unknown as SortDirection ?? SortDirection.Ascending,
    muscleGroupId: params.get('muscleGroupId') ?? '',
    workoutDate: params.get('workoutDate') ? new Date(params.get('workoutDate') || '') : undefined
  }
  
  const response = await getPagedWorkouts(pagedRequest);

  if (response === null) {
    return <div>Loading...</div>;
  }

  const { items: workouts, pagingData } = response;
  

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