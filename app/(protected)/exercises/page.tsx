"use client";
import { ExerciseApiService } from '@/src/api/services/exercise-api-service';
import { getPagedExercises, IExerciseRequest } from '@/src/data/exercise';
import { ExerciseLogType, SortDirection } from '@/src/types/enums';
import { ExerciseIndex } from '@/src/views/exercise/exercise-index';
import { useEffect, useState } from 'react';
import { IExercise } from '@/src/models/domain/exercise';
import { IPagedResponse, IPagingDataResponseDto } from '@/src/types/common';

export default function ExercisesPage(
  props: {
    searchParams: Record<string, string>;
  }
) {

  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [pagingData, setPagingData] = useState<IPagingDataResponseDto>({});
  const [isLoading, setIsLoading] = useState(true);

  const searchParams =  props.searchParams;

  // Konstruiramo URLSearchParams objekt na temelju searchParams
  const params = new URLSearchParams(
    Object.entries(searchParams)
      .flatMap(([key, value]) =>
        Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value ?? ""]]
      )
  );

  useEffect(() => {
    const getExercises = async () => {
      setIsLoading(true);
      const service = new ExerciseApiService();
      const response = await service.getExercises(params);
      setExercises(response.items);
      setPagingData(response.pagingData);
      setIsLoading(false);
    };

    // const pagedRequest: IExerciseRequest = {
    //   page: parseInt(params.get('page') ?? '0'),
    //   pageSize: parseInt(params.get('pageSize') ?? '12'),
    //   search: params.get('search') ?? '',
    //   sortColumn: params.get('sortColumn') ?? '',
    //   sortDirection: params.get('sortDirection') as unknown as SortDirection ?? SortDirection.Ascending,
    //   muscleGroupId: params.get('muscleGroupId') ?? '',
    //   exerciseLogType: parseInt(params.get('logType') ?? '0') as unknown as ExerciseLogType ?? ExerciseLogType.Unknown,    
    // }
    getExercises();
  },[searchParams]);

  

  // const response = await getPagedExercises(pagedRequest);

  if (isLoading === null) {
    return <div>Loading...</div>;
  }

  // const { items: exercises, pagingData } = response;  

  return (
    <ExerciseIndex
      exercises={exercises}
      currentPage={pagingData.page}
      pageSize={pagingData.pageSize}
      totalPages={pagingData.totalPages} />
  );
}