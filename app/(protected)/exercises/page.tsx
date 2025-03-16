import { getPagedExercises, IExerciseRequest } from '@/src/data/exercise';
import { ExerciseLogType, SortDirection } from '@/src/Types/Enums';
import { ExerciseIndex } from '@/views/exercise/ExerciseIndex';

export default async function ExercisesPage(
  props: {
    searchParams: Promise<Record<string, string>>;
  }
) {
  const searchParams = await props.searchParams;

  // Konstruiramo URLSearchParams objekt na temelju searchParams
  const params = new URLSearchParams(
    Object.entries(searchParams)
      .flatMap(([key, value]) =>
        Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value ?? ""]]
      )
  );

  const pagedRequest: IExerciseRequest = {
    page: parseInt(params.get('page') ?? '0'),
    pageSize: parseInt(params.get('pageSize') ?? '12'),
    search: params.get('search') ?? '',
    sortColumn: params.get('sortColumn') ?? '',
    sortDirection: params.get('sortDirection') as unknown as SortDirection ?? SortDirection.Ascending,
    muscleGroupId: params.get('muscleGroupId') ?? '',
    exerciseLogType: parseInt(params.get('logType') ?? '0') as unknown as ExerciseLogType ?? ExerciseLogType.Unknown,    
  }

  const { items: exercises, pagingData } = await getPagedExercises(pagedRequest);

  if (exercises === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <ExerciseIndex
      exercises={exercises}
      currentPage={pagingData.page}
      pageSize={pagingData.pageSize}
      totalPages={pagingData.totalPages} />
  );
}