import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface SelectProps<T> {
    options: T[];
    selected: T;
    onChange: (option: T) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
}

export function Select<T>({ options, selected, onChange, getOptionLabel, getOptionValue }: SelectProps<T>) {
    return (
        <Listbox value={selected} onChange={onChange}>
            <div className="relative">
                <ListboxButton className={cn(
                    'relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left',
                    'bg-white dark:bg-slate-800',
                    'border border-gray-300 dark:border-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500',
                    'text-gray-900 dark:text-white'
                )}>
                    <span className="block truncate">{getOptionLabel(selected)}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </ListboxButton>
                <Transition
                    as="div"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ListboxOptions className={cn(
                        'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                        'sm:text-sm'
                    )}>
                        {options.map((option) => (
                            <ListboxOption
                                key={getOptionValue(option)}
                                value={option}
                                className={({ active }) => cn(
                                    'relative cursor-default select-none py-2 pl-10 pr-4',
                                    active ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white' : 'text-gray-900 dark:text-white'
                                )}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                                            {getOptionLabel(option)}
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
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Transition>
            </div>
        </Listbox>
    );
}
