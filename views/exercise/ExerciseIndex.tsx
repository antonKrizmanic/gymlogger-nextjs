'use client';


import { Card, CardContent } from "@/src/components/ui/card";
import { Container } from "@/src/components/Common/Container";
import { Grid } from "@/src/components/Common/Grid";
import { LogTypeSelect } from "@/src/components/Common/LogTypeSelect";
import { MuscleGroupSelect } from "@/src/components/Common/MuscleGroupSelect";
import { Pagination } from "@/src/components/Common/Pagination";
import { SearchBar } from "@/src/components/Common/SearchBar";
import { ExerciseCard } from "@/src/components/Exercise/ExerciseCard";
import { FilterIcon, PlusIcon } from "@/src/components/Icons";
import { Button } from "@/src/components/ui/button";
import { IExercise } from "@/src/Models/Domain/Exercise";
import { ExerciseLogType } from "@/src/Types/Enums";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

interface ExerciseIndexProps {
    exercises: IExercise[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export function ExerciseIndex({ exercises, currentPage, pageSize, totalPages }: ExerciseIndexProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>(searchParams?.get('muscleGroup') || '');
    const [selectedLogType, setSelectedLogType] = useState<ExerciseLogType | undefined>(
        searchParams?.get('logType') ? Number(searchParams.get('logType')) as ExerciseLogType : undefined
    );

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsLoading(false);
    }, [exercises]);

    const updateUrl = useCallback((
        page: number,
        search: string,
        size: number,
        muscleGroup?: string,
        logType?: ExerciseLogType
    ) => {
        setIsLoading(true);
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
        const newPage = 0;
        updateUrl(newPage, value, pageSize, selectedMuscleGroup, selectedLogType);
    };

    const handleMuscleGroupChange = (muscleGroupId: string) => {
        setSelectedMuscleGroup(muscleGroupId);
        const newPage = 0;
        updateUrl(newPage, searchTerm, pageSize, muscleGroupId, selectedLogType);
    };

    const handleLogTypeChange = (newValue: ExerciseLogType) => {
        setSelectedLogType(newValue);
        const newPage = 0;
        updateUrl(newPage, searchTerm, pageSize, selectedMuscleGroup, newValue);
    };

    const handlePageSizeChange = (newValue: string) => {
        const newSize = Number(newValue);
        const newPage = 0;
        updateUrl(newPage, searchTerm, newSize, selectedMuscleGroup, selectedLogType);
    };

    const handlePageChange = (page: number) => {
        updateUrl(page, searchTerm, pageSize, selectedMuscleGroup, selectedLogType);
    };

    const handleExerciseDelete = useCallback(() => {
        // Refresh the current page
        updateUrl(currentPage, searchTerm, pageSize, selectedMuscleGroup, selectedLogType);
    }, [currentPage, searchTerm, pageSize, selectedMuscleGroup, selectedLogType, updateUrl]);

    return (
        <Container>
            <div className="pb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Exercises</h1>
            </div>
            {/* Top controls */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/exercises/create">
                                <PlusIcon />
                                New
                            </Link>
                        </Button>
                        <Button onClick={() => setIsFilterOpen(!isFilterOpen)}>
                            <FilterIcon />
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
        </Container>
    );
}