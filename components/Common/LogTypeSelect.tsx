import { ExerciseLogType } from '@/src/Types/Enums';
import { cn } from '@/lib/utils';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface LogTypeSelectProps {
    selectedLogType: ExerciseLogType;
    onLogTypeChange: (logType: ExerciseLogType) => void;
    required?: boolean;
}

const logTypeOptions = [
    { value: ExerciseLogType.WeightAndReps, label: 'Weight and Reps' },
    { value: ExerciseLogType.TimeOnly, label: 'Time Only' },
    { value: ExerciseLogType.RepsOnly, label: 'Reps Only' },
];

export function LogTypeSelect({
    selectedLogType,
    onLogTypeChange,
    required = false
}: LogTypeSelectProps) {
    const selectedOption = logTypeOptions.find(option => option.value === selectedLogType) || logTypeOptions[0];

    return (
        <div className="space-y-2">
            <label htmlFor="logType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Log Type {required && '*'}
            </label>
            <Listbox value={selectedOption} onChange={(option) => onLogTypeChange(option.value)}>
                <div className="relative">
                    <Listbox.Button className={cn(
                        'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white'
                    )}>
                        <span className="block truncate">{selectedOption.label}</span>
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
                            {logTypeOptions.map((option) => (
                                <Listbox.Option
                                    key={option.value}
                                    value={option}
                                    className={({ active }) => cn(
                                        'relative cursor-default select-none py-2 pl-10 pr-4',
                                        active ? 'bg-primary-100 dark:bg-slate-700 text-primary-900 dark:text-white' : 'text-gray-900 dark:text-white'
                                    )}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                                                {option.label}
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