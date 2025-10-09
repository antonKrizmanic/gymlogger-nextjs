'use client';

import { WorkoutApiService } from "@/src/api/services/workout-api-service";
import { Grid } from "@/src/components/common/grid";
import { MuscleGroupSelect } from "@/src/components/common/muscle-group-select";
import { Pagination } from "@/src/components/common/pagination";
import { SearchBar } from "@/src/components/common/search-bar";
import { DatePicker } from "@/src/components/form/date-picker";
import { WorkoutCard } from "@/src/components/workout/workout-card";
import { Button } from "@/src/components/ui/button";
import { IWorkoutRequest } from "@/src/data/workout";
import { IWorkoutSimple } from "@/src/models/domain/workout";
import { cn } from "@/src/lib/utils";
import { IPagingDataResponseDto } from "@/src/types/common";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

interface WorkoutsIndexProps {
    isFilterOpen: boolean;
    onFiltersDismiss?: () => void;
}

function isValidDate(date: any) {
    return date instanceof Date && !isNaN(date.getTime());
}

export function WorkoutsIndex({ isFilterOpen, onFiltersDismiss }: WorkoutsIndexProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [workouts, setWorkouts] = useState<IWorkoutSimple[]>([]);
    const [pagingData, setPagingData] = useState<IPagingDataResponseDto>({
        page: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
        totalItems: 0,
    } as IPagingDataResponseDto);
    const [workoutRequest, setWorkoutRequest] = useState<IWorkoutRequest>({
        page: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        search: '',
        muscleGroupId: undefined,
        workoutDate: undefined,
    } as IWorkoutRequest);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
    const [workoutDate, setWorkoutDate] = useState<Date | null | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    // Access the current values for pagination using useMemo to avoid recalculations
    const { currentPage, pageSize, totalPages } = useMemo(() => ({
        currentPage: pagingData.page,
        pageSize: pagingData.pageSize,
        totalPages: pagingData.totalPages
    }), [pagingData]);

    useEffect(() => {
        const page = Number(searchParams.get('page') || '0');
        const size = Number(searchParams.get('pageSize') || DEFAULT_PAGE_SIZE.toString());
        const search = searchParams.get('search') || '';
        const muscleGroupId = searchParams.get('muscleGroupId') || undefined;
        const workoutDateParam = searchParams.get('workoutDate') || null;

        setWorkoutRequest((prev) => ({
            ...prev,
            page,
            pageSize: size,
            search,
            muscleGroupId,
            workoutDate: workoutDateParam ? new Date(workoutDateParam) : null,
        } as IWorkoutRequest));
        setSearchTerm(search);
        setSelectedMuscleGroup(muscleGroupId || '');
        setWorkoutDate(workoutDateParam ? new Date(workoutDateParam) : undefined);
    }, [searchParams]);

    const updateUrl = useCallback((
        page: number,
        search: string,
        size: number,
        muscleGroup?: string,
        date?: Date | null
    ) => {
        const params = new URLSearchParams();
        if (page > 0) params.set('page', page.toString());
        if (search) params.set('search', search);
        if (size !== DEFAULT_PAGE_SIZE) params.set('pageSize', size.toString());
        if (muscleGroup) params.set('muscleGroupId', muscleGroup);
        if (date && isValidDate(date)) {
            const fixedDate = new Date(date);
            fixedDate.setDate(fixedDate.getDate() + 1);
            params.set('workoutDate', fixedDate.toISOString().split('T')[0]);
        }
        const query = params.toString();
        router.push(`/workouts${query ? `?${query}` : ''}`);
    }, [router]);

    // Fetch workouts when request changes
    useEffect(() => {
        const fetchWorkouts = async () => {
            setIsLoading(true);
            try {
                const service = new WorkoutApiService();
                const response = await service.getWorkouts(workoutRequest);

                setWorkouts(response.items);
                setPagingData(response.pagingData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkouts();
    }, [workoutRequest]);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        updateUrl(0, value, pageSize, selectedMuscleGroup, workoutDate);
        onFiltersDismiss?.();
    }, [pageSize, selectedMuscleGroup, workoutDate, updateUrl, onFiltersDismiss]);

    const handleMuscleGroupChange = useCallback((muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        updateUrl(0, searchTerm, pageSize, muscleGroupId, workoutDate);
        onFiltersDismiss?.();
    }, [searchTerm, pageSize, workoutDate, updateUrl, onFiltersDismiss]);

    const handleWorkoutDateChange = useCallback((newValue?: Date | null) => {
        setWorkoutDate(newValue);
        updateUrl(0, searchTerm, pageSize, selectedMuscleGroup, newValue);
        onFiltersDismiss?.();
    }, [searchTerm, pageSize, selectedMuscleGroup, updateUrl, onFiltersDismiss]);

    const handlePageSizeChange = useCallback((newValue: string) => {
        const newSize = Number(newValue);
        updateUrl(0, searchTerm, newSize, selectedMuscleGroup, workoutDate);
    }, [searchTerm, selectedMuscleGroup, workoutDate, updateUrl]);

    const handlePageChange = useCallback((page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateUrl(page, searchTerm, pageSize, selectedMuscleGroup, workoutDate);
    }, [searchTerm, pageSize, selectedMuscleGroup, workoutDate, updateUrl]);

    const handleWorkoutDelete = useCallback(() => {
        updateUrl(currentPage, searchTerm, pageSize, selectedMuscleGroup, workoutDate);
    }, [currentPage, searchTerm, pageSize, selectedMuscleGroup, workoutDate, updateUrl]);

    const handleResetFilters = useCallback(() => {
        setSearchTerm("");
        setSelectedMuscleGroup("");
        setWorkoutDate(undefined);
        updateUrl(0, "", pageSize, undefined, undefined);
        onFiltersDismiss?.();
    }, [pageSize, updateUrl, onFiltersDismiss]);

    const hasActiveFilters = Boolean(searchTerm || selectedMuscleGroup || workoutDate);

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start">
            <aside
                className={cn(
                    "space-y-6",
                    "lg:sticky lg:top-28",
                    isFilterOpen ? "block" : "hidden lg:block"
                )}
            >
                <div className="rounded-3xl border border-border/70 bg-card/95 p-6 shadow-card-rest">
                    <div className="flex items-center justify-between gap-2">
                        <p className="type-label text-muted-foreground uppercase tracking-wide">Filter workouts</p>
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
                            placeholder="Search workouts"
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
                            <p className="type-label text-muted-foreground uppercase tracking-wide">Workout date</p>
                            <DatePicker
                                value={workoutDate || undefined}
                                onChange={handleWorkoutDateChange}
                                maxDate={new Date()}
                                clearable
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-border/60 bg-background/70 p-5 text-xs text-muted-foreground shadow-card-rest">
                    Tip: Filters stay sticky on desktop so you can refine your search while scrolling through workouts.
                </div>
            </aside>

            <section className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <p className="type-label text-muted-foreground uppercase tracking-wide">Results</p>
                        <h2 className="type-heading-sm text-foreground">
                            {pagingData.totalItems ?? 0} workout{(pagingData.totalItems ?? 0) === 1 ? "" : "s"}
                        </h2>
                    </div>
                    <div className="type-body-sm text-muted-foreground sm:text-right">
                        Showing page {currentPage + 1} of {Math.max(totalPages, 1)}
                    </div>
                </div>

                <Grid
                    items={workouts}
                    renderItem={(workout) => (
                        <WorkoutCard
                            key={workout.id}
                            workout={workout}
                            onDelete={handleWorkoutDelete}
                        />
                    )}
                    isLoading={isLoading}
                    emptyMessage="No workouts found"
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
}