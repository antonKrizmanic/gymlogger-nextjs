"use client";
import { ExerciseApiService } from '@/src/api/services/exercise-api-service';
import { ExerciseIndex } from '@/src/views/exercise/exercise-index';
import { useEffect, useState } from 'react';
import { IExercise } from '@/src/models/domain/exercise';
import { IPagingDataResponseDto } from '@/src/types/common';

export default function ExercisesPage(
  props: {
    searchParams: Record<string, string>;
  }
) {
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [pagingData, setPagingData] = useState<IPagingDataResponseDto>({
    page: 0,
    pageSize: 12,
    totalPages: 0,
    totalItems: 0,
  } as IPagingDataResponseDto);
  
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
    
    getExercises();
  },[searchParams, params]);

  if (isLoading === null) {
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