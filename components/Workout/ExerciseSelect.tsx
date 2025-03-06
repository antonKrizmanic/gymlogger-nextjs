import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { IExercise } from '@/src/Models/Domain/Exercise';
import { ExerciseService } from '@/src/Api/Services/ExerciseService';
import { cn } from '@/lib/utils';
import { SortDirection } from '@/src/Types/Enums';

interface ExerciseSelectProps {
    selectedExerciseId?: string;
    onExerciseSelect: (exerciseId: string) => void;
    required?: boolean;
}

export function ExerciseSelect({ selectedExerciseId, onExerciseSelect, required }: ExerciseSelectProps) {
    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setIsLoading(true);
                const service = new ExerciseService();
                const response = await service.getExercises({
                    page: 0,
                    pageSize: 1000,
                    sortColumn: 'name',
                    sortDirection: SortDirection.Ascending
                });
                setExercises(response.items || []);
            } catch (error) {
                console.error('Failed to fetch exercises:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const filteredExercises = query === ''
        ? exercises
        : exercises.filter((exercise) =>
            exercise.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

    const selectedExercise = exercises.find(ex => ex.id === selectedExerciseId);

    return (
        <Combobox value={selectedExercise} onChange={(exercise) => onExerciseSelect(exercise?.id || '')}>
            <div className="relative">
                <div className="relative w-full">
                    <Combobox.Input
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
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                <Combobox.Option
                                    key={exercise.id}
                                    className={({ active }) =>
                                        cn(
                                            'relative cursor-default select-none py-2 pl-10 pr-4',
                                            active ? 'bg-primary-500 text-white' : 'text-gray-900 dark:text-white'
                                        )
                                    }
                                    value={exercise}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                {exercise.name}
                                            </span>
                                            <span className={cn(
                                                'absolute inset-y-0 left-0 flex items-center pl-3',
                                                active ? 'text-white' : 'text-primary-500'
                                            )}>
                                                {selected && (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </span>
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
} 