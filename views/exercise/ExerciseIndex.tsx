'use client';

import { ActionButton } from "@/components/Common/ActionButton";
import { Card } from "@/components/Common/Card";
import { Container } from "@/components/Common/Container";
import { Grid } from "@/components/Common/Grid";
import { LogTypeSelect } from "@/components/Common/LogTypeSelect";
import { MuscleGroupSelect } from "@/components/Common/MuscleGroupSelect";
import { Pagination } from "@/components/Common/Pagination";
import { SearchBar } from "@/components/Common/SearchBar";
import { ExerciseCard } from "@/components/Exercise/ExerciseCard";
import { FilterIcon, PlusIcon } from "@/components/Icons";
import { useDebounce } from "@/hooks/useDebounce";
import { IExercise } from "@/src/Models/Domain/Exercise";
import { ExerciseLogType } from "@/src/Types/Enums";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

interface ExerciseIndexProps {
    exercises: IExercise[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    isLoading: boolean;
}

export function ExerciseIndex({ exercises, currentPage, pageSize, totalPages, isLoading }: ExerciseIndexProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>(searchParams.get('muscleGroup') || '');
    const [selectedLogType, setSelectedLogType] = useState<ExerciseLogType | undefined>(
        searchParams.get('logType') ? Number(searchParams.get('logType')) as ExerciseLogType : undefined
    );

    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        currentPage = 0;
        updateUrl(currentPage, value, pageSize, selectedMuscleGroup, selectedLogType);
    };

    const handleMuscleGroupChange = (muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        currentPage = 0;
        updateUrl(currentPage, searchTerm, pageSize, muscleGroupId, selectedLogType);
    };

    const handleLogTypeChange = (newValue: ExerciseLogType) => {
        console.log('Log type changed:', newValue);
        setSelectedLogType(newValue);
        currentPage = 0;
        updateUrl(currentPage, searchTerm, pageSize, selectedMuscleGroup, newValue);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(event.target.value);
        updateUrl(currentPage, searchTerm, newSize, selectedMuscleGroup, selectedLogType);
    };

    const handlePageChange = (page: number) => {
        updateUrl(page, searchTerm, pageSize, selectedMuscleGroup, selectedLogType);
    };

    // const handleExerciseDelete = () => {
    //     fetchExercises();
    // };

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
                                selectedLogType={selectedLogType ?? ExerciseLogType.Unknown}
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
                    // onDeleteComplete={handleExerciseDelete}
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