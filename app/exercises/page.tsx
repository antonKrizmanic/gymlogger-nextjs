import { ExerciseService } from '@/src/Api/Services/ExerciseService';
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
  
  const exerciseService = new ExerciseService();
  const { items: exercises, pagingData } = await exerciseService.getExercises(params);  

  if(exercises === undefined) {
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