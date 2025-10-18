'use client';

import { ChevronDown, type LucideIcon } from 'lucide-react';
import * as React from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/src/components/ui/command';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from '@/src/components/ui/drawer';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/src/components/ui/popover';
import { useMediaQuery } from '@/src/hooks/use-media-query';

export type ComboboxItem = {
    value: string;
    label: string;
    [key: string]: any;
};

interface ResponsiveComboboxProps {
    items: ComboboxItem[];
    placeholder: string;
    emptyMessage: string;
    filterPlaceholder: string;
    value?: ComboboxItem | null;
    defaultValue?: ComboboxItem | null;
    onValueChange?: (item: ComboboxItem | null) => void;
    icon?: LucideIcon;
    label?: string;
    className?: string;
}

export const ResponsiveCombobox = ({
    items,
    placeholder,
    emptyMessage,
    filterPlaceholder,
    value,
    defaultValue,
    onValueChange,
    icon: Icon,
    label,
    className,
}: ResponsiveComboboxProps) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    // For internal state when used in uncontrolled mode
    const [internalValue, setInternalValue] =
        React.useState<ComboboxItem | null>(defaultValue || null);

    // Determine if we're in controlled or uncontrolled mode
    const isControlled = value !== undefined;
    const selectedItem = isControlled ? value : internalValue;

    const handleSelectItem = (item: ComboboxItem | null) => {
        if (!isControlled) {
            setInternalValue(item);
        }

        if (onValueChange) {
            onValueChange(item);
        }

        setOpen(false);
    };

    const TriggerContent = (
        <div
            className={`flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-secondary transition-all duration-200 ${open ? 'border-primary/50 bg-muted/40 shadow-sm' : ''} ${label ? '' : 'py-3'} cursor-pointer ${className || ''}`}
        >
            {Icon && (
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
            )}
            <div className="flex-1 flex items-center justify-between">
                <div className="flex-1">
                    {label && (
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {label}
                        </p>
                    )}
                    <div
                        className={`text-lg font-semibold bg-transparent border-none outline-none w-full ${label ? 'mt-1' : ''} ${!selectedItem ? 'text-muted-foreground' : 'text-foreground'}`}
                    >
                        {selectedItem ? selectedItem.label : placeholder}
                    </div>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{TriggerContent}</PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <ItemList
                        items={items}
                        onSelectItem={handleSelectItem}
                        emptyMessage={emptyMessage}
                        filterPlaceholder={filterPlaceholder}
                        selectedValue={selectedItem?.value}
                    />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{TriggerContent}</DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <ItemList
                        items={items}
                        onSelectItem={handleSelectItem}
                        emptyMessage={emptyMessage}
                        filterPlaceholder={filterPlaceholder}
                        selectedValue={selectedItem?.value}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

function ItemList({
    items,
    onSelectItem,
    emptyMessage,
    filterPlaceholder,
    selectedValue,
}: {
    items: ComboboxItem[];
    onSelectItem: (item: ComboboxItem | null) => void;
    emptyMessage: string;
    filterPlaceholder: string;
    selectedValue?: string;
}) {
    const [search, setSearch] = React.useState('');

    return (
        <Command
            filter={(value, search) => {
                // Custom filter function that matches on label, not value
                if (!search) return 1;
                const item = items.find((item) => item.value === value);
                if (!item) return 0;

                return item.label.toLowerCase().includes(search.toLowerCase())
                    ? 1
                    : 0;
            }}
            className="[&_[cmdk-item]]:text-gray-800 dark:[&_[cmdk-item]]:text-gray-200"
            value={selectedValue}
        >
            <CommandInput
                placeholder={filterPlaceholder}
                value={search}
                onValueChange={setSearch}
                className="text-gray-800 dark:text-gray-200 placeholder:text-gray-500"
            />
            <CommandList>
                <CommandEmpty className="text-gray-800 dark:text-gray-200">
                    {emptyMessage}
                </CommandEmpty>
                <CommandGroup>
                    {items.map((item) => (
                        <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={(value) => {
                                onSelectItem(
                                    items.find((i) => i.value === value) ||
                                        null,
                                );
                                setSearch(''); // Reset search after selection
                            }}
                            className={`text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${
                                selectedValue === item.value
                                    ? 'bg-accent text-accent-foreground'
                                    : ''
                            }`}
                        >
                            {item.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
