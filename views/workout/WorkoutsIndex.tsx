'use client';

import { ActionButton } from "@/components/Common/ActionButton";
import { Card } from "@/components/Common/Card";
import { Container } from "@/components/Common/Container";
import { Grid } from "@/components/Common/Grid";
import { MuscleGroupSelect } from "@/components/Common/MuscleGroupSelect";
import { Pagination } from "@/components/Common/Pagination";
import { SearchBar } from "@/components/Common/SearchBar";
import { FilterIcon, PlusIcon } from "@/components/Icons";
import { WorkoutCard } from "@/components/Workout/WorkoutCard";
import { DateInput } from "@/components/Form/TextInput";
import { IWorkout } from "@/src/Models/Domain/Workout";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const DEFAULT_PAGE_SIZE = 12;

interface WorkoutsIndexProps {
    workouts: IWorkout[];
    currentPage: number;
    pageSize: number;
    totalPages: number;    
}

export function WorkoutsIndex({ workouts, currentPage, pageSize, totalPages }: WorkoutsIndexProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>(searchParams.get('muscleGroup') || '');
    const [workoutDate, setWorkoutDate] = useState<string | undefined>(searchParams.get('date') || undefined);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        setIsLoading(false);
    },[workouts]);    

    const updateUrl = useCallback((
        page: number,
        search: string,
        size: number,
        muscleGroup?: string,
        date?: string
    ) => {  
        setIsLoading(true);      
        const params = new URLSearchParams();
        if (page > 0) params.set('page', page.toString());
        if (search) params.set('search', search);
        if (size !== DEFAULT_PAGE_SIZE) params.set('size', size.toString());
        if (muscleGroup) params.set('muscleGroupId', muscleGroup);
        if (date) params.set('workoutDate', date);
        const query = params.toString();
        router.push(`/workouts${query ? `?${query}` : ''}`);
    }, [router]);

    // Update URL when search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchParams.get('search')) {
            const newPage = 0;
            updateUrl(newPage, debouncedSearchTerm, pageSize, selectedMuscleGroup, workoutDate);
        }
    }, [debouncedSearchTerm, searchParams, pageSize, selectedMuscleGroup, workoutDate, updateUrl]);

    const handleSearch = (value: string) => {        
        setSearchTerm(value);
    };

    const handleMuscleGroupChange = (muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        const newPage = 0;
        updateUrl(newPage, searchTerm, pageSize, muscleGroupId, workoutDate);
    };

    const handleDateChange = (date: string | undefined) => {
        setWorkoutDate(date);
        const newPage = 0;
        updateUrl(newPage, searchTerm, pageSize, selectedMuscleGroup, date);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(event.target.value);
        const newPage = 0;
        updateUrl(newPage, searchTerm, newSize, selectedMuscleGroup, workoutDate);
    };

    const handlePageChange = (page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateUrl(page, searchTerm, pageSize, selectedMuscleGroup, workoutDate);
    };

    const handleWorkoutDelete = useCallback(() => {
        // Refresh the current page
        updateUrl(currentPage, searchTerm, pageSize, selectedMuscleGroup, workoutDate);
    }, [currentPage, searchTerm, pageSize, selectedMuscleGroup, workoutDate, updateUrl]);    

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
                                value={workoutDate || ''}
                                onChange={handleDateChange}
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
        </Container>
    );
}