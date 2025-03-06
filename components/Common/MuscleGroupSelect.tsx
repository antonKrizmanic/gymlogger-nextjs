import { useEffect, useState } from 'react';
import { IMuscleGroup } from '@/src/Models/Domain/MuscleGroup';
import { MuscleGroupService } from '@/src/Api/Services/MuscleGroupService';
import { SortDirection } from '@/src/Types/Enums';
import { cn } from '@/lib/utils';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface MuscleGroupSelectProps {
    selectedMuscleGroup: string;
    onMuscleGroupChange: (muscleGroupId: string) => void;
}

export function MuscleGroupSelect({
    selectedMuscleGroup,
    onMuscleGroupChange,
}: MuscleGroupSelectProps) {
    const [muscleGroups, setMuscleGroups] = useState<IMuscleGroup[]>([]);

    useEffect(() => {
        const fetchMuscleGroups = async () => {
            try {
                const service = new MuscleGroupService();
                const response = await service.getMuscleGroups({
                    page: 0,
                    pageSize: 100,
                    sortColumn: 'name',
                    sortDirection: SortDirection.Ascending
                });
                setMuscleGroups(response.items ?? []);
            } catch (error) {
                console.error('Failed to fetch muscle groups:', error);
            }
        };

        fetchMuscleGroups();
    }, []);


    const selectedGroup = muscleGroups.find(group => group.id === selectedMuscleGroup) || { id: '', name: 'All Muscle Groups' };

    return (

        <div className="space-y-2">
            <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Muscle Group
            </label>
            <Listbox value={selectedGroup} onChange={(group) => onMuscleGroupChange(group.id)}>
                <div className="relative">
                    <Listbox.Button className={cn(
                        'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white'
                    )}>
                        <span className="block truncate">{selectedGroup.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as="div"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className={cn(
                            'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md',
                            'bg-white dark:bg-slate-800',
                            'border border-gray-300 dark:border-gray-700',
                            'py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                            'sm:text-sm'
                        )}>
                            <Listbox.Option
                                key="all"
                                value={{ id: '', name: 'All Muscle Groups' }}
                                className={({ active }) => cn(
                                    'relative cursor-default select-none py-2 pl-10 pr-4',
                                    active ? 'bg-primary-100 dark:bg-slate-700 text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
                                )}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                                            All Muscle Groups
                                        </span>
                                        {selected ? (
                                            <span className={cn(
                                                'absolute inset-y-0 left-0 flex items-center pl-3',
                                                'text-gray-600 dark:text-primary-400'
                                            )}>
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                            {muscleGroups.map((group) => (
                                <Listbox.Option
                                    key={group.id}
                                    value={group}
                                    className={({ active }) => cn(
                                        'relative cursor-default select-none py-2 pl-10 pr-4',
                                        active ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white' : 'text-gray-900 dark:text-white'
                                    )}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                                                {group.name}
                                            </span>
                                            {selected ? (
                                                <span className={cn(
                                                    'absolute inset-y-0 left-0 flex items-center pl-3',
                                                    'text-primary-600 dark:text-primary-400'
                                                )}>
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
} 