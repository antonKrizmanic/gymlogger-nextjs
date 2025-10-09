'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ExerciseApiService } from "@/src/api/services/exercise-api-service";
import { Grid } from "@/src/components/common/grid";
import { LogTypeSelect } from "@/src/components/common/log-type-select";
import { MuscleGroupSelect } from "@/src/components/common/muscle-group-select";
import { Pagination } from "@/src/components/common/pagination";
import { SearchBar } from "@/src/components/common/search-bar";
import { ExerciseCard } from "@/src/components/exercise/exercise-card";
import { Button } from "@/src/components/ui/button";
import { IExerciseRequest } from "@/src/data/exercise";
import { cn } from "@/src/lib/utils";
import { IExercise } from "@/src/models/domain/exercise";
import { IPagingDataResponseDto } from "@/src/types/common";
import { ExerciseLogType } from "@/src/types/enums";

const DEFAULT_PAGE_SIZE = 12;

export interface IExerciseIndexProps {
  isFilterOpen: boolean;
  onFiltersDismiss?: () => void;
}

export const ExerciseIndex = ({ isFilterOpen, onFiltersDismiss }: IExerciseIndexProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [pagingData, setPagingData] = useState<IPagingDataResponseDto>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalItems: 0,
  } as IPagingDataResponseDto);
  const [exerciseRequest, setExerciseRequest] = useState<IExerciseRequest>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    search: "",
    muscleGroupId: undefined,
    exerciseLogType: undefined,
  } as IExerciseRequest);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [selectedLogType, setSelectedLogType] = useState<ExerciseLogType>(ExerciseLogType.Unknown);
  const [searchTerm, setSearchTerm] = useState("");

  const { currentPage, pageSize, totalPages, totalItems } = useMemo(() => ({
    currentPage: pagingData.page,
    pageSize: pagingData.pageSize,
    totalPages: pagingData.totalPages,
    totalItems: pagingData.totalItems ?? 0,
  }), [pagingData]);

  useEffect(() => {
    const page = Number(searchParams.get("page") ?? "0");
    const size = Number(searchParams.get("size") ?? DEFAULT_PAGE_SIZE.toString());
    const search = searchParams.get("search") ?? "";
    const muscleGroup = searchParams.get("muscleGroup") ?? "";
    const logTypeParam = searchParams.get("logType");
    const parsedLogType = logTypeParam ? Number(logTypeParam) as ExerciseLogType : ExerciseLogType.Unknown;

    setSearchTerm(search);
    setSelectedMuscleGroup(muscleGroup);
    setSelectedLogType(parsedLogType);

    setExerciseRequest({
      page,
      pageSize: size,
      search,
      muscleGroupId: muscleGroup || undefined,
      exerciseLogType: parsedLogType === ExerciseLogType.Unknown ? undefined : parsedLogType,
    } as IExerciseRequest);
  }, [searchParams]);

  const updateUrl = useCallback((
    page: number,
    search: string,
    size: number,
    muscleGroup?: string,
    logType?: ExerciseLogType,
  ) => {
    const params = new URLSearchParams();
    if (page > 0) params.set("page", page.toString());
    if (size !== DEFAULT_PAGE_SIZE) params.set("size", size.toString());
    if (search) params.set("search", search);
    if (muscleGroup) params.set("muscleGroup", muscleGroup);
    if (logType !== undefined && logType !== ExerciseLogType.Unknown) {
      params.set("logType", logType.toString());
    }
    const query = params.toString();
    router.push(`/exercises${query ? `?${query}` : ""}`);
  }, [router]);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const service = new ExerciseApiService();
        const response = await service.getExercises(exerciseRequest);
        setExercises(response.items);
        setPagingData(response.pagingData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [exerciseRequest]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    updateUrl(0, value, pageSize, selectedMuscleGroup, selectedLogType);
    onFiltersDismiss?.();
  }, [pageSize, selectedMuscleGroup, selectedLogType, updateUrl, onFiltersDismiss]);

  const handleMuscleGroupChange = useCallback((muscleGroupId: string) => {
    setSelectedMuscleGroup(muscleGroupId);
    updateUrl(0, searchTerm, pageSize, muscleGroupId, selectedLogType);
    onFiltersDismiss?.();
  }, [searchTerm, pageSize, selectedLogType, updateUrl, onFiltersDismiss]);

  const handleLogTypeChange = useCallback((newValue: ExerciseLogType) => {
    setSelectedLogType(newValue);
    updateUrl(0, searchTerm, pageSize, selectedMuscleGroup, newValue);
    onFiltersDismiss?.();
  }, [searchTerm, pageSize, selectedMuscleGroup, updateUrl, onFiltersDismiss]);

  const handlePageSizeChange = useCallback((newValue: string) => {
    const newSize = Number(newValue);
    updateUrl(0, searchTerm, newSize, selectedMuscleGroup, selectedLogType);
  }, [searchTerm, selectedMuscleGroup, selectedLogType, updateUrl]);

  const handlePageChange = useCallback((page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateUrl(page, searchTerm, pageSize, selectedMuscleGroup, selectedLogType);
  }, [searchTerm, pageSize, selectedMuscleGroup, selectedLogType, updateUrl]);

  const handleExerciseDelete = useCallback(() => {
    updateUrl(currentPage, searchTerm, pageSize, selectedMuscleGroup, selectedLogType);
  }, [currentPage, searchTerm, pageSize, selectedMuscleGroup, selectedLogType, updateUrl]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedMuscleGroup("");
    setSelectedLogType(ExerciseLogType.Unknown);
    updateUrl(0, "", pageSize, undefined, ExerciseLogType.Unknown);
    onFiltersDismiss?.();
  }, [pageSize, updateUrl, onFiltersDismiss]);

  const hasActiveFilters = Boolean(
    searchTerm || selectedMuscleGroup || selectedLogType !== ExerciseLogType.Unknown,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start">
      <aside
        className={cn(
          "space-y-6",
          "lg:sticky lg:top-28",
          isFilterOpen ? "block" : "hidden lg:block",
        )}
      >
        <div className="rounded-3xl border border-border/70 bg-card/95 p-6 shadow-card-rest">
          <div className="flex items-center justify-between gap-2">
            <p className="type-label text-muted-foreground uppercase tracking-wide">Filter exercises</p>
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-semibold"
                onClick={handleResetFilters}
              >
                Clear
              </Button>
            ) : null}
          </div>

          <div className="space-y-5 pt-5">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search exercises"
              density="compact"
            />

            <div className="space-y-2">
              <p className="type-label text-muted-foreground uppercase tracking-wide">Muscle focus</p>
              <MuscleGroupSelect
                selectedMuscleGroup={selectedMuscleGroup}
                onMuscleGroupChange={handleMuscleGroupChange}
              />
            </div>

            <div className="space-y-2">
              <p className="type-label text-muted-foreground uppercase tracking-wide">Log type</p>
              <LogTypeSelect
                selectedLogType={selectedLogType}
                onLogTypeChange={handleLogTypeChange}
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-background/70 p-5 text-xs text-muted-foreground shadow-card-rest">
          Tip: Filters stay visible on desktop so you can refine your search while browsing the exercise cards.
        </div>
      </aside>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="type-label text-muted-foreground uppercase tracking-wide">Results</p>
            <h2 className="type-heading-sm text-foreground">
              {totalItems.toLocaleString()} exercise{totalItems === 1 ? "" : "s"}
            </h2>
          </div>
          <div className="type-body-sm text-muted-foreground sm:text-right">
            Showing page {currentPage + 1} of {Math.max(totalPages, 1)}
          </div>
        </div>

        <Grid<IExercise>
          items={exercises}
          renderItem={(exercise) => (
            <ExerciseCard
              exercise={exercise}
              onDelete={handleExerciseDelete}
            />
          )}
          keyExtractor={(exercise) => exercise.id}
          isLoading={isLoading}
          emptyMessage="No exercises found"
          density="comfortable"
          className="grid-flow-dense"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </section>
    </div>
  );
};