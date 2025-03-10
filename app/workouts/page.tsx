'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
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
import { MuscleGroupSelect } from '@/components/Common/MuscleGroupSelect';
import { Card } from '@/components/Common/Card';
import { DateInput } from '@/components/Form/TextInput';
import { FilterIcon, PlusIcon } from '@/components/Icons';
import { Container } from '@/components/ui/Container';

const DEFAULT_PAGE_SIZE = 12;


function WorkoutsContent() {
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
        if (size) params.set('size', size.toString());
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
        <Container>
            <div className="pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Workouts</h1>
            </div>
            {/* Top controls */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <ActionButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <FilterIcon />
                            Filter
                        </ActionButton>
                        <ActionButton href={'/workouts/create'}>
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
                            <DateInput
                                label="Workout Date"
                                id="workoutDate"
                                value={workoutDate?.toISOString().split('T')[0] || ''}
                                onChange={(value) => handleDateChange(value ? new Date(value) : undefined)}
                            />
                        </div>
                    </Card>
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
            />
        </Container>
    );
}

export default function WorkoutsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        }>
            <WorkoutsContent />
        </Suspense>
    );
} 