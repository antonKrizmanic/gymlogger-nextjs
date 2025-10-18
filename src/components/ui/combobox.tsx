'use client';

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/src/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/src/components/ui/command';
import { Label } from '@/src/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/src/components/ui/popover';
import { cn } from '@/src/lib/utils';

export interface ComboboxProps<T> {
    items: T[];
    value?: string;
    onValueChange: (value: string) => void;
    displayValue: (item: T | undefined) => string;
    filterFunction?: (item: T, query: string) => boolean;
    placeholder?: string;
    emptyMessage?: string;
    loadingMessage?: string;
    isLoading?: boolean;
    disabled?: boolean;
    required?: boolean;
    label?: string;
    labelClassName?: string;
    className?: string;
    renderItem?: (item: T) => React.ReactNode;
    getItemValue: (item: T) => string;
    getItemDisplay: (item: T) => string;
}

export function Combobox<T>({
    items,
    value,
    onValueChange,
    displayValue,
    filterFunction,
    placeholder = 'Search items...',
    emptyMessage = 'No items found.',
    loadingMessage = 'Loading items...',
    isLoading = false,
    disabled = false,
    required = false,
    label,
    labelClassName,
    className,
    renderItem,
    getItemValue,
    getItemDisplay,
}: ComboboxProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

    // Default filter function if none provided
    const defaultFilterFunction = (item: T, query: string) => {
        return getItemDisplay(item)
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''));
    };

    const filter = filterFunction || defaultFilterFunction;

    // Filter items based on search query
    const filteredItems = React.useMemo(() => {
        if (!query) return items;
        return items.filter((item) => filter(item, query));
    }, [items, query, filter]);

    // Find the selected item
    const selectedItem = React.useMemo(() => {
        if (!value) return undefined;
        return items.find((item) => getItemValue(item) === value);
    }, [items, value, getItemValue]);

    return (
        <div className={cn('relative', className)}>
            {label && (
                <Label className={cn('mb-2 block', labelClassName)}>
                    {label}{' '}
                    {required && <span className="text-destructive">*</span>}
                </Label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'w-full justify-between',
                            !selectedItem && 'text-muted-foreground',
                        )}
                        disabled={disabled}
                    >
                        {selectedItem
                            ? displayValue(selectedItem)
                            : placeholder}
                        {isLoading ? (
                            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                        ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder={placeholder}
                            onValueChange={setQuery}
                            className="h-9"
                        />
                        <CommandList>
                            {isLoading ? (
                                <CommandEmpty>{loadingMessage}</CommandEmpty>
                            ) : filteredItems.length === 0 ? (
                                <CommandEmpty>{emptyMessage}</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {filteredItems.map((item) => (
                                        <CommandItem
                                            key={getItemValue(item)}
                                            value={getItemValue(item)}
                                            onSelect={(currentValue) => {
                                                onValueChange(
                                                    currentValue === value
                                                        ? ''
                                                        : currentValue,
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            {renderItem ? (
                                                renderItem(item)
                                            ) : (
                                                <>
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            value ===
                                                                getItemValue(
                                                                    item,
                                                                )
                                                                ? 'opacity-100'
                                                                : 'opacity-0',
                                                        )}
                                                    />
                                                    {getItemDisplay(item)}
                                                </>
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
