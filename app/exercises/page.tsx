'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { ExerciseCard } from '@/components/Exercise/ExerciseCard';
import { IExercise } from '@/src/Models/Domain/Exercise';
import { ExerciseService, IExerciseRequest } from '@/src/Api/Services/ExerciseService';
import { ExerciseLogType, SortDirection } from '@/src/Types/Enums';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from '@/components/Common/SearchBar';
import { Pagination } from '@/components/Common/Pagination';
import { Grid } from '@/components/Common/Grid';
import { MuscleGroupSelect } from '@/components/Common/MuscleGroupSelect';
import { ActionButton } from '@/components/Common/ActionButton';
import { Card } from '@/components/Common/Card';
import { LogTypeSelect } from '@/components/Common/LogTypeSelect';
import { Container } from '@/components/ui/Container';
import { FilterIcon, PlusIcon } from '@/components/Icons';

const DEFAULT_PAGE_SIZE = 12;

function ExercisesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [pageSize, setPageSize] = useState(Number(searchParams.get('size')) || DEFAULT_PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>(searchParams.get('muscleGroup') || '');
    const [selectedLogType, setSelectedLogType] = useState<ExerciseLogType | undefined>(
        searchParams.get('logType') ? Number(searchParams.get('logType')) as ExerciseLogType : undefined
    );

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const totalPages = Math.ceil(totalItems / pageSize);

    const updateUrl = useCallback((
        page: number,
        search: string,
        size: number,
        muscleGroup?: string,
        logType?: ExerciseLogType
    ) => {
        const params = new URLSearchParams();
        if (page > 0) params.set('page', page.toString());
        if (search) params.set('search', search);
        if (size !== DEFAULT_PAGE_SIZE) params.set('size', size.toString());
        if (muscleGroup) params.set('muscleGroupId', muscleGroup);
        if (logType !== undefined) params.set('logType', logType.toString());
        const query = params.toString();
        router.push(`/exercises${query ? `?${query}` : ''}`);
    }, [router]);

    const fetchExercises = useCallback(async () => {
        setIsLoading(true);
        try {
            const service = new ExerciseService();
            const request: IExerciseRequest = {
                page: currentPage,
                pageSize: pageSize,
                search: debouncedSearchTerm,
                muscleGroupId: selectedMuscleGroup || undefined,
                exerciseLogType: selectedLogType,
                sortColumn: 'name',
                sortDirection: SortDirection.Ascending
            };

            const response = await service.getExercises(request);
            setExercises(response.items ?? []);
            setTotalItems(response.pagingData.totalItems);
        } catch (error) {
            console.error('Failed to fetch exercises:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, debouncedSearchTerm, selectedMuscleGroup, selectedLogType]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    useEffect(() => {
        updateUrl(currentPage, debouncedSearchTerm, pageSize, selectedMuscleGroup, selectedLogType);
    }, [currentPage, debouncedSearchTerm, pageSize, selectedMuscleGroup, selectedLogType, updateUrl]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const handleMuscleGroupChange = (muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        setCurrentPage(0);
    };

    const handleLogTypeChange = (newValue: ExerciseLogType) => {
        setSelectedLogType(newValue);
        setCurrentPage(0);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        setCurrentPage(0);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExerciseDelete = () => {
        fetchExercises();
    };

    return (
        <Container>
            <div className="pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Exercises</h1>
            </div>
            {/* Top controls */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <ActionButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <FilterIcon />
                            Filter
                        </ActionButton>
                        <ActionButton href={'/exercises/create'}>
                            <PlusIcon />
                            New
                        </ActionButton>
                    </div>
                </div>

                {/* Filter card */}
                {isFilterOpen && (
                    <Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MuscleGroupSelect
                                selectedMuscleGroup={selectedMuscleGroup}
                                onMuscleGroupChange={handleMuscleGroupChange}
                            />
                            <LogTypeSelect
                                selectedLogType={selectedLogType ?? ExerciseLogType.WeightAndReps}
                                onLogTypeChange={handleLogTypeChange}
                            />
                        </div>
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
                        onDeleteComplete={handleExerciseDelete}
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
        </Container>
    );
}

export default function ExercisesPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        }>
            <ExercisesContent />
        </Suspense>
    );
} 