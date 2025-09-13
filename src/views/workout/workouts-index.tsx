'use client';

import { WorkoutApiService } from "@/src/api/services/workout-api-service";
import { Grid } from "@/src/components/common/grid";
import { MuscleGroupSelect } from "@/src/components/common/muscle-group-select";
import { Pagination } from "@/src/components/common/pagination";
import { SearchBar } from "@/src/components/common/search-bar";
import { DatePicker } from "@/src/components/form/date-picker";
import { WorkoutCard } from "@/src/components/workout/workout-card";
import { IWorkoutRequest } from "@/src/data/workout";
import { IWorkoutSimple } from "@/src/models/domain/workout";
import { IPagingDataResponseDto } from "@/src/types/common";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

interface WorkoutsIndexProps {
    isFilterOpen: boolean;
}

function isValidDate(date: any) {
    return date instanceof Date && !isNaN(date.getTime());
}

export function WorkoutsIndex({ isFilterOpen }: WorkoutsIndexProps) {
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
    }, [pageSize, selectedMuscleGroup, workoutDate, updateUrl]);

    const handleMuscleGroupChange = useCallback((muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        updateUrl(0, searchTerm, pageSize, muscleGroupId, workoutDate);
    }, [searchTerm, pageSize, workoutDate, updateUrl]);

    const handleWorkoutDateChange = useCallback((newValue?: Date | null) => {
        setWorkoutDate(newValue);
        updateUrl(0, searchTerm, pageSize, selectedMuscleGroup, newValue);
    }, [searchTerm, pageSize, selectedMuscleGroup, updateUrl]);

    const handlePageSizeChange = useCallback((newValue: string) => {
        const newSize = Number(newValue);
        updateUrl(0, searchTerm, newSize, selectedMuscleGroup, workoutDate);
    }, [searchTerm, selectedMuscleGroup, workoutDate, updateUrl]);

    const handlePageChange = useCallback((page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateUrl(page, searchTerm, pageSize, selectedMuscleGroup, workoutDate);
    }, [searchTerm, pageSize, selectedMuscleGroup, workoutDate, updateUrl]);

    const handleWorkoutDelete = useCallback(() => {
        // Refresh the current page
        updateUrl(currentPage, searchTerm, pageSize, selectedMuscleGroup, workoutDate);
    }, [currentPage, searchTerm, pageSize, selectedMuscleGroup, workoutDate, updateUrl]);

    return (
        <>
            <div className="mb-8 space-y-4">
                {/* Filter card */}
                {isFilterOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                        <MuscleGroupSelect
                            selectedMuscleGroup={selectedMuscleGroup}
                            onMuscleGroupChange={handleMuscleGroupChange}
                        />
                        <DatePicker
                            label="Workout Date"
                            value={workoutDate || undefined}
                            onChange={handleWorkoutDateChange}
                            maxDate={new Date()}
                            clearable
                        />
                    </div>
                )}

                <SearchBar
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search workouts..."
                />
            </div>

            {/* Workout grid */}
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

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
            />
        </>
    );
}