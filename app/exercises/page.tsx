import { IExercise } from '@/src/Models/Domain/Exercise';
import { IPagedResponse } from '@/src/Types/Common';
import { ExerciseIndex } from '@/views/exercise/ExerciseIndex';

async function getExercises(searchParams: URLSearchParams): Promise<IPagedResponse<IExercise>> {
    const queryString = searchParams.toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/exercises?${queryString}`, {
      cache: "no-store",
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch exercises");
    }
    
    return res.json();
  }

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
  const { items: exercises, pagingData } = await getExercises(params);


  if(exercises === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <ExerciseIndex
      exercises={exercises}
      currentPage={pagingData.page}
      pageSize={pagingData.pageSize}
      totalPages={pagingData.totalPages}      
      isLoading={false}/>    
  );
}