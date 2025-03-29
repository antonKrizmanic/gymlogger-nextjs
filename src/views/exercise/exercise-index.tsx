'use client';

import { Card, CardContent } from "@/src/components/ui/card";
import { Grid } from "@/src/components/common/grid";
import { LogTypeSelect } from "@/src/components/common/log-type-select";
import { MuscleGroupSelect } from "@/src/components/common/muscle-group-select";
import { Pagination } from "@/src/components/common/pagination";
import { SearchBar } from "@/src/components/common/search-bar";
import { ExerciseCard } from "@/src/components/exercise/exercise-card";
import { IExercise } from "@/src/models/domain/exercise";
import { ExerciseLogType } from "@/src/types/enums";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { ExerciseApiService } from "@/src/api/services/exercise-api-service";
import { IPagingDataResponseDto } from "@/src/types/common";
import { IExerciseRequest } from "@/src/data/exercise";

const DEFAULT_PAGE_SIZE = 12;

export interface IExerciseIndexProps {
    isFilterOpen: boolean;
}

export const ExerciseIndex = ({ isFilterOpen }: IExerciseIndexProps) => {
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
        search: '',
        muscleGroupId: undefined,
        exerciseLogType: undefined
    } as IExerciseRequest);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
    const [selectedLogType, setSelectedLogType] = useState<ExerciseLogType | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    // Access the current values for pagination using useMemo to avoid recalculations
    const { currentPage, pageSize, totalPages } = useMemo(() => ({
        currentPage: pagingData.page,
        pageSize: pagingData.pageSize,
        totalPages: pagingData.totalPages
    }), [pagingData]);

    // Initialize from URL parameters on component mount
    useEffect(() => {
        const page = Number(searchParams.get('page') || '0');
        const size = Number(searchParams.get('size') || DEFAULT_PAGE_SIZE.toString());
        const search = searchParams.get('search') || '';
        const muscleGroup = searchParams.get('muscleGroup') || '';
        const logType = searchParams.get('logType') ?
            Number(searchParams.get('logType')) as ExerciseLogType :
            undefined;

        setSearchTerm(search);
        setSelectedMuscleGroup(muscleGroup);
        setSelectedLogType(logType);

        setExerciseRequest({
            page,
            pageSize: size,
            search,
            muscleGroupId: muscleGroup || undefined,
            exerciseLogType: logType
        } as IExerciseRequest);
    }, [searchParams]);

    // Update request with new parameters - removed router dependency since it's not used
    const updateUrl = useCallback((
        page: number,
        search: string,
        size: number,
        muscleGroup?: string,
        logType?: ExerciseLogType
    ) => {        
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('size', size.toString());
        if (search) params.set('search', search);
        if (muscleGroup) params.set('muscleGroup', muscleGroup);
        if (logType !== undefined) params.set('logType', logType.toString());
        router.push(`/exercises?${params.toString()}`);        
    }, [router]);

    // Fetch exercises when request changes
    useEffect(() => {
        const fetchExercises = async () => {
            setIsLoading(true);
            try {
                const service = new ExerciseApiService();
                const response = await service.getExercises(exerciseRequest);
                setExercises(response.items);
                setPagingData(response.pagingData);
            } catch (error) {
                // Handle error appropriately
            } finally {
                setIsLoading(false);
            }
        };

        fetchExercises();
    }, [exerciseRequest]);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        updateUrl(0, value, pageSize, selectedMuscleGroup, selectedLogType);
    }, [pageSize, selectedMuscleGroup, selectedLogType, updateUrl]);

    const handleMuscleGroupChange = useCallback((muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        updateUrl(0, searchTerm, pageSize, muscleGroupId, selectedLogType);
    }, [searchTerm, pageSize, selectedLogType, updateUrl]);

    const handleLogTypeChange = useCallback((newValue: ExerciseLogType) => {
        setSelectedLogType(newValue);
        updateUrl(0, searchTerm, pageSize, selectedMuscleGroup, newValue);
    }, [searchTerm, pageSize, selectedMuscleGroup, updateUrl]);

    const handlePageSizeChange = useCallback((newValue: string) => {
        const newSize = Number(newValue);
        updateUrl(0, searchTerm, newSize, selectedMuscleGroup, selectedLogType);
    }, [searchTerm, selectedMuscleGroup, selectedLogType, updateUrl]);

    const handlePageChange = useCallback((page: number) => {
        updateUrl(page, searchTerm, pageSize, selectedMuscleGroup, selectedLogType);
    }, [searchTerm, pageSize, selectedMuscleGroup, selectedLogType, updateUrl]);

    const handleExerciseDelete = useCallback(() => {
        // Refresh the current page
        updateUrl(currentPage, searchTerm, pageSize, selectedMuscleGroup, selectedLogType);
    }, [currentPage, searchTerm, pageSize, selectedMuscleGroup, selectedLogType, updateUrl]);

    return (
        <>
            <div className="mb-8 space-y-4">
                {/* Filter card */}
                {isFilterOpen && (
                    <Card>
                        <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="w-full md:w-1/2">
                                <MuscleGroupSelect
                                    selectedMuscleGroup={selectedMuscleGroup}
                                    onMuscleGroupChange={handleMuscleGroupChange}
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <LogTypeSelect
                                    selectedLogType={selectedLogType ?? ExerciseLogType.Unknown}
                                    onLogTypeChange={handleLogTypeChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Search bar */}
                <SearchBar
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search exercises..."
                />
            </div>

            {/* Exercise grid */}
            <Grid
                items={exercises}
                renderItem={(exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onDelete={handleExerciseDelete}
                    />
                )}
                isLoading={isLoading}
                emptyMessage="No exercises found"
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