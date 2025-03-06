'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkoutCard } from '@/components/Workout/WorkoutCard';
import { IWorkout } from '@/src/Models/Domain/Workout';
import { WorkoutService, IWorkoutRequest } from '@/src/Api/Services/WorkoutService';
import { SortDirection } from '@/src/Types/Enums';
import { useDebounce } from '@/hooks/useDebounce';
import { Grid } from '@/components/Common/Grid';
import { Pagination } from '@/components/Common/Pagination';
import { SearchBar } from '@/components/Common/SearchBar';
import { ActionButton } from '@/components/Common/ActionButton';
import { cn } from '@/lib/utils';
import { MuscleGroupSelect } from '@/components/Common/MuscleGroupSelect';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
const DEFAULT_PAGE_SIZE = 12;

export default function WorkoutsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [workouts, setWorkouts] = useState<IWorkout[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [pageSize, setPageSize] = useState(Number(searchParams.get('size')) || DEFAULT_PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [workoutDate, setWorkoutDate] = useState<Date | undefined>(
        searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined
    );
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>(
        searchParams.get('muscleGroup') || ''
    );

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const totalPages = Math.ceil(totalItems / pageSize);

    const updateUrl = useCallback((
        page: number, 
        search: string, 
        size: number,
        date?: Date,
        muscleGroup?: string
    ) => {
        const params = new URLSearchParams();
        if (page > 0) params.set('page', page.toString());
        if (search) params.set('search', search);
        if (size !== DEFAULT_PAGE_SIZE) params.set('size', size.toString());
        if (date) params.set('date', date.toISOString().split('T')[0]);
        if (muscleGroup) params.set('muscleGroup', muscleGroup);
        const query = params.toString();
        router.push(`/workouts${query ? `?${query}` : ''}`);
    }, [router]);

    const fetchWorkouts = useCallback(async () => {
        setIsLoading(true);
        try {
            const service = new WorkoutService();
            const request = {
                page: currentPage,
                pageSize: pageSize,
                search: debouncedSearchTerm,
                sortColumn: 'Date',
                sortDirection: SortDirection.Descending,
                muscleGroupId: selectedMuscleGroup || undefined,
                workoutDate: workoutDate
            };

            const response = await service.getWorkouts(request as IWorkoutRequest);
            setWorkouts(response.items ?? []);
            setTotalItems(response.pagingData.totalItems);
        } catch (error) {
            console.error('Failed to fetch workouts:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, debouncedSearchTerm, workoutDate, selectedMuscleGroup]);    

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    useEffect(() => {
        updateUrl(currentPage, debouncedSearchTerm, pageSize, workoutDate, selectedMuscleGroup);
    }, [currentPage, debouncedSearchTerm, pageSize, workoutDate, selectedMuscleGroup, updateUrl]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
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

    const handleWorkoutDelete = () => {
        fetchWorkouts();
    };

    const handleDateChange = (date: Date | undefined) => {
        setWorkoutDate(date);
        setCurrentPage(0);
    };

    const handleMuscleGroupChange = (muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        setCurrentPage(0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Top controls */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <ActionButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
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
                        </ActionButton>
                        <ActionButton onClick={() => router.push('/workouts/create')}>
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
                            New Workout
                        </ActionButton>
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
                                <label htmlFor="workoutDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Workout Date
                                </label>
                                <input
                                    type="date"
                                    id="workoutDate"
                                    value={workoutDate?.toISOString().split('T')[0] || ''}
                                    onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : undefined)}
                                    className={cn(
                                        'w-full px-3 py-2 rounded-lg',
                                        'bg-white dark:bg-slate-800',
                                        'border border-gray-300 dark:border-gray-700',
                                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                                        'text-gray-900 dark:text-white'
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {/* Search bar */}
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
                        onDeleteComplete={handleWorkoutDelete}
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