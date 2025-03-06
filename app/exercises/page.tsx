'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExerciseCard } from '@/components/Exercise/ExerciseCard';
import { IExercise } from '@/src/Models/Domain/Exercise';
import { ExerciseService, IExerciseRequest } from '@/src/Api/Services/ExerciseService';
import { ExerciseLogType, SortDirection } from '@/src/Types/Enums';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from '@/components/Common/SearchBar';
import { Pagination } from '@/components/Common/Pagination';
import { Grid } from '@/components/Common/Grid';
import { MuscleGroupSelect } from '@/components/Common/MuscleGroupSelect';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
const DEFAULT_PAGE_SIZE = 12;

export default function ExercisesPage() {
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

    const handleLogTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value ? Number(event.target.value) as ExerciseLogType : undefined;
        setSelectedLogType(value);
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
        // After successful deletion, refresh the list
        fetchExercises();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Top controls */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={cn(
                                'px-4 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'text-gray-700 dark:text-gray-300',
                                'hover:bg-gray-50 dark:hover:bg-slate-700',
                                'flex items-center gap-2'
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                                />
                            </svg>
                            Filter
                        </button>
                        <button
                            onClick={() => router.push('/exercises/create')}
                            className={cn(
                                'px-4 py-2 rounded-lg',
                                'bg-white dark:bg-slate-800',
                                'border border-gray-300 dark:border-gray-700',
                                'text-gray-700 dark:text-gray-300',
                                'hover:bg-gray-50 dark:hover:bg-slate-700',
                                'flex items-center gap-2'
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            New
                        </button>
                    </div>
                </div>

                {/* Filter card */}
                {isFilterOpen && (
                    <div className={cn(
                        'p-4 rounded-lg',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'space-y-4'
                    )}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <MuscleGroupSelect
                                    selectedMuscleGroup={selectedMuscleGroup}
                                    onMuscleGroupChange={handleMuscleGroupChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="logType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Log Type
                                </label>
                                <select
                                    id="logType"
                                    value={selectedLogType?.toString() ?? ''}
                                    onChange={handleLogTypeChange}
                                    className={cn(
                                        'w-full px-3 py-2 rounded-lg',
                                        'bg-white dark:bg-slate-800',
                                        'border border-gray-300 dark:border-gray-700',
                                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                        'text-gray-900 dark:text-white'
                                    )}
                                >
                                    <option value="">All Log Types</option>
                                    <option value={ExerciseLogType.WeightAndReps}>Weight and Reps</option>
                                    <option value={ExerciseLogType.TimeOnly}>Time Only</option>
                                    <option value={ExerciseLogType.RepsOnly}>Reps Only</option>
                                </select>
                            </div>
                        </div>
                    </div>
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
                pageSizeOptions={ITEMS_PER_PAGE_OPTIONS}
            />

        </div>
    );
} 