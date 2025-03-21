'use client';

import { Button } from "@/src/components/ui/button";

import { Container } from "@/src/components/Common/Container";
import { Grid } from "@/src/components/Common/Grid";
import { MuscleGroupSelect } from "@/src/components/Common/MuscleGroupSelect";
import { Pagination } from "@/src/components/Common/Pagination";
import { SearchBar } from "@/src/components/Common/SearchBar";
import { WorkoutCard } from "@/src/components/Workout/WorkoutCard";
import { IWorkoutSimple } from "@/src/Models/Domain/Workout";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/src/hooks/useDebounce";
import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import { DatePicker } from "@/src/components/Form/date-picket";
import { Filter, Plus } from "lucide-react";

const DEFAULT_PAGE_SIZE = 12;

interface WorkoutsIndexProps {
    workouts: IWorkoutSimple[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

function isValidDate(date: any) {
    return date instanceof Date && !isNaN(date.getTime());
}

export function WorkoutsIndex({ workouts, currentPage, pageSize, totalPages }: WorkoutsIndexProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>(searchParams?.get('muscleGroup') || '');
    const [workoutDate, setWorkoutDate] = useState<Date | undefined | null>(new Date(searchParams?.get('workoutDate') || ''));
    const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        setIsLoading(false);
    }, [workouts]);

    const updateUrl = useCallback((
        page: number,
        search: string,
        size: number,
        muscleGroup?: string,
        date?: Date | null
    ) => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (page > 0) params.set('page', page.toString());
        if (search) params.set('search', search);
        if (size !== DEFAULT_PAGE_SIZE) params.set('size', size.toString());
        if (muscleGroup) params.set('muscleGroupId', muscleGroup);
        if (date && isValidDate(date)) {
            const fixedDate = new Date(date);
            fixedDate.setDate(fixedDate.getDate() + 1);
            params.set('workoutDate', fixedDate.toISOString().split('T')[0]);
        }
        const query = params.toString();
        router.push(`/workouts${query ? `?${query}` : ''}`);
    }, [router]);

    // Update URL when search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchParams?.get('search')) {
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

    const handleDateChange = (date?: Date | null) => {
        setWorkoutDate(date);
        const newPage = 0;
        updateUrl(newPage, searchTerm, pageSize, selectedMuscleGroup, date);
    };

    const handlePageSizeChange = (newValue: string) => {
        const newSize = Number(newValue);
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
                        <Button asChild>
                            <Link href='/workouts/create'>
                                <Plus />
                                New
                            </Link>
                        </Button>
                        <Button onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <Filter />
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Filter card */}
                {isFilterOpen && (
                    <Card>
                        <CardContent className="flex flex-row justify-between items-center p-4 gap-4">
                            <div className="w-1/2">
                                <MuscleGroupSelect
                                    selectedMuscleGroup={selectedMuscleGroup}
                                    onMuscleGroupChange={handleMuscleGroupChange}
                                />
                            </div>
                            <div className="w-1/2">
                                <DatePicker
                                    label="Workout Date"
                                    value={workoutDate || undefined}
                                    onChange={handleDateChange}
                                    maxDate={new Date()}
                                    clearable
                                />
                            </div>
                        </CardContent>
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