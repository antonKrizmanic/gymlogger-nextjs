import { Fragment, useState, useEffect, useMemo } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import { IExercise } from '@/src/Models/Domain/Exercise';
import { ExerciseApiService } from '@/src/Api/Services/ExerciseApiService';
import { cn } from '@/src/lib/utils';
import { SortDirection } from '@/src/Types/Enums';
import { useDebounce } from '@/src/hooks/useDebounce';

interface ExerciseSelectProps {
    selectedExerciseId?: string;
    onExerciseSelect: (exerciseId: string) => void;
    required?: boolean;
}

export function ExerciseSelect({ selectedExerciseId, onExerciseSelect, required }: ExerciseSelectProps) {
    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setIsLoading(true);
                const service = new ExerciseApiService();
                const response = await service.getAllExercises();
                
                setExercises(response || []);
            } catch (error) {
                console.error('Failed to fetch exercises:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExercises();
    }, []);

    // Memoized filtered exercises based on the debounced query
    const filteredExercises = useMemo(() => {
        if (!debouncedQuery) return exercises;
        
        const normalizedQuery = debouncedQuery.toLowerCase().replace(/\s+/g, '');
        
        return exercises.filter((exercise) =>
            exercise.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(normalizedQuery)
        );
    }, [debouncedQuery, exercises]);

    const selectedExercise = useMemo(() => 
        exercises.find(ex => ex.id === selectedExerciseId), 
        [exercises, selectedExerciseId]
    );

    const handleSelect = (exercise: IExercise | null) => {
        onExerciseSelect(exercise?.id || '');
    };

    return (
        <Combobox value={selectedExercise} onChange={handleSelect}>
            <div className="relative">
                <div className="relative w-full">
                    <ComboboxInput
                        className={cn(
                            'w-full px-3 py-2 rounded-lg',
                            'bg-white dark:bg-slate-800',
                            'border border-gray-300 dark:border-gray-700',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500',
                            'text-gray-900 dark:text-white',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                        displayValue={(exercise: IExercise) => exercise?.name || ''}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search exercises..."
                        required={required}
                    />
                </div>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {isLoading ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                Loading exercises...
                            </div>
                        ) : filteredExercises.length === 0 ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                No exercises found.
                            </div>
                        ) : (
                            filteredExercises.map((exercise) => (
                                <ComboboxOption
                                    key={exercise.id}
                                    className={({ focus }) =>
                                        cn(
                                            'relative cursor-default select-none py-2 pl-10 pr-4',
                                            focus ? 'bg-gray-100 dark:bg-slate-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                                        )
                                    }
                                    value={exercise}
                                >
                                    {({ selected, focus }) => (
                                        <>
                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                {exercise.name}
                                            </span>
                                            <span className={cn(
                                                'absolute inset-y-0 left-0 flex items-center pl-3',
                                                focus ? 'text-white' : 'text-primary-500'
                                            )}>
                                                {selected && (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </span>
                                        </>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </Transition>
            </div>
        </Combobox>
    );
}