'use client';

import { format, isValid, parse } from 'date-fns';
import { CalendarIcon, ChevronDown, type LucideIcon } from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: LucideIcon;
    label?: string;
    placeholder?: string;
    className?: string;
}

interface IconSelectProps {
    icon: LucideIcon;
    label?: string;
    placeholder?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    className?: string;
    disabled?: boolean;
}

interface IconTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    icon: LucideIcon;
    label?: string;
    placeholder?: string;
    className?: string;
}

interface IconDatePickerProps {
    icon?: LucideIcon;
    label?: string;
    placeholder?: string;
    value?: Date | null;
    onChange?: (date?: Date | null) => void;
    dateFormat?: string;
    className?: string;
    disabled?: boolean;
    clearable?: boolean;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    isInModal?: boolean;
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
    function IconInput({ icon: Icon, label, className, ...props }, ref) {
        const hasLabel = Boolean(label);

        return (
            <div
                className={`flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-secondary transition-all duration-200 focus-within:border-primary/50 focus-within:bg-muted/40 focus-within:shadow-sm ${hasLabel ? '' : 'py-3'}`}
            >
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    {hasLabel && (
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {label}
                        </p>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        className={`text-lg font-semibold bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/60 transition-colors duration-200 focus:text-primary ${hasLabel ? 'mt-1' : ''} ${className || ''}`}
                    />
                </div>
            </div>
        );
    },
);

IconInput.displayName = 'IconInput';

export function IconSelect({
    icon: Icon,
    label,
    placeholder = 'Select option...',
    value,
    onValueChange,
    options,
    disabled = false,
}: IconSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const DROPDOWN_MAX_HEIGHT_PX = 240; // matches max-h-60
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollAncestorsRef = React.useRef<HTMLElement[]>([]);
    const hasLabel = Boolean(label);
    const selectedOption = options.find((opt) => opt.value === value);

    const updateDropdownPosition = React.useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Estimate dropdown height (approx 40px per option, capped by max height)
            const estimatedHeight = Math.min(
                DROPDOWN_MAX_HEIGHT_PX,
                Math.max(40, options.length * 40),
            );
            const spaceBelow = window.innerHeight - rect.bottom;
            // For position: fixed we must use viewport coordinates (no scroll offsets)
            let top = rect.bottom + 4; // default place below
            if (spaceBelow < estimatedHeight && rect.top > estimatedHeight) {
                // Place above if not enough space below and enough space above
                top = rect.top - estimatedHeight - 4;
            }
            setDropdownPosition({
                top,
                left: rect.left,
                width: rect.width,
            });
        }
    }, [options.length]);

    const addScrollListenersToAncestors = React.useCallback(() => {
        scrollAncestorsRef.current = [];
        let el = containerRef.current?.parentElement;
        const handler = () => updateDropdownPosition();
        while (el) {
            // Attach to each ancestor to react to their scroll
            el.addEventListener('scroll', handler, { passive: true });
            scrollAncestorsRef.current.push(el as HTMLElement);
            el = el.parentElement;
        }
        return () => {
            scrollAncestorsRef.current.forEach((a) =>
                a.removeEventListener('scroll', handler as EventListener),
            );
            scrollAncestorsRef.current = [];
        };
    }, [updateDropdownPosition]);

    React.useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
            // Update position on scroll or resize
            const handlePositionUpdate = () => updateDropdownPosition();
            window.addEventListener('scroll', handlePositionUpdate, {
                passive: true,
            });
            window.addEventListener('resize', handlePositionUpdate, {
                passive: true as unknown as boolean,
            });
            window.addEventListener('orientationchange', handlePositionUpdate, {
                passive: true as unknown as boolean,
            });
            // Add listeners to scrollable ancestors
            const cleanupAncestors = addScrollListenersToAncestors();
            return () => {
                window.removeEventListener('scroll', handlePositionUpdate);
                window.removeEventListener('resize', handlePositionUpdate);
                window.removeEventListener(
                    'orientationchange',
                    handlePositionUpdate,
                );
                cleanupAncestors();
            };
        }
    }, [isOpen, updateDropdownPosition, addScrollListenersToAncestors]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                // Update position when opening
                setTimeout(updateDropdownPosition, 0);
            }
        }
    };

    const handleSelect = (optionValue: string) => {
        onValueChange?.(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                className={`flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-secondary transition-all duration-200 ${isOpen ? 'border-primary/50 bg-muted/40 shadow-sm' : ''} ${hasLabel ? '' : 'py-3'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div
                    className="flex-1 flex items-center justify-between"
                    onClick={handleToggle}
                >
                    <div className="flex-1">
                        {hasLabel && (
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                {label}
                            </p>
                        )}
                        <div
                            className={`text-lg font-semibold bg-transparent border-none outline-none w-full ${hasLabel ? 'mt-1' : ''} ${!selectedOption ? 'text-muted-foreground' : 'text-foreground'}`}
                        >
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </div>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isOpen &&
                !disabled &&
                ReactDOM.createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div
                            className="fixed bg-popover border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-auto will-change-transform"
                            style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                                width: dropdownPosition.width,
                            }}
                        >
                            {options.map((option) => {
                                const isActive = option.value === value;
                                return (
                                    <div
                                        key={option.value}
                                        role="option"
                                        aria-selected={isActive}
                                        className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors
                                        hover:bg-accent hover:text-accent-foreground
                                        ${isActive ? 'bg-accent/60 text-accent-foreground' : ''}`}
                                        onClick={() =>
                                            handleSelect(option.value)
                                        }
                                    >
                                        <div
                                            className={`p-1.5 rounded-md ${isActive ? 'bg-primary/20' : 'bg-primary/10'}`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-primary'}`}
                                            />
                                        </div>
                                        <span className="text-sm font-medium">
                                            {option.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </>,
                    document.body,
                )}
        </div>
    );
}

export function IconTextarea({
    icon: Icon,
    label,
    className,
    ...props
}: IconTextareaProps) {
    const hasLabel = Boolean(label);

    return (
        <div
            className={`flex items-start space-x-4 p-4 bg-muted/30 rounded-lg border border-secondary transition-all duration-200 focus-within:border-primary/50 focus-within:bg-muted/40 focus-within:shadow-sm ${hasLabel ? '' : 'py-3'}`}
        >
            <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
                {hasLabel && (
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {label}
                    </p>
                )}
                <textarea
                    {...props}
                    className={`text-lg font-semibold bg-transparent border-none outline-none w-full resize-none placeholder:text-muted-foreground/60 transition-colors duration-200 focus:text-primary ${hasLabel ? 'mt-1' : ''} ${className || ''}`}
                    rows={4}
                />
            </div>
        </div>
    );
}

export function IconDatePicker({
    icon: Icon = CalendarIcon,
    label,
    placeholder = 'Pick a date',
    value,
    onChange,
    dateFormat = 'dd.MM.yyyy.',
    className,
    disabled = false,
    clearable = true,
    required = false,
    minDate,
    maxDate,
    isInModal = false,
}: IconDatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<
        Date | null | undefined
    >(value);
    const hasLabel = Boolean(label);

    // Helper function to update input value from date
    const updateInputValueFromDate = React.useCallback(
        (date: Date | null | undefined) => {
            if (date) {
                try {
                    setInputValue(format(date, dateFormat));
                } catch {
                    setInputValue('');
                }
            } else {
                setInputValue('');
            }
        },
        [dateFormat],
    );

    // Update internal state when external value changes
    React.useEffect(() => {
        setSelectedDate(value);
        updateInputValueFromDate(value);
    }, [value, updateInputValueFromDate]);

    // Handle date selection from calendar
    const handleSelect = (date?: Date | null) => {
        if (date) {
            const newDate = new Date(date.setHours(0, 0, 0, 0));
            setSelectedDate(newDate);
            updateInputValueFromDate(newDate);
            onChange?.(newDate);
        } else {
            setSelectedDate(null);
            setInputValue('');
            onChange?.(null);
        }
        setOpen(false);
    };

    // Handle manual input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setError(null);

        if (!newValue) {
            setSelectedDate(null);
            onChange?.(null);
            return;
        }

        try {
            // Try to parse the input value as a date
            const parsedDate = parse(newValue, dateFormat, new Date());

            // Check if the parsed date is valid
            if (isValid(parsedDate)) {
                // Check if the date is within the allowed range
                if (minDate && parsedDate < minDate) {
                    setError(
                        `Date must be after ${format(minDate, dateFormat)}`,
                    );
                    return;
                }

                if (maxDate && parsedDate > maxDate) {
                    setError(
                        `Date must be before ${format(maxDate, dateFormat)}`,
                    );
                    return;
                }

                const normalizedDate = new Date(
                    parsedDate.setHours(0, 0, 0, 0),
                );
                setSelectedDate(normalizedDate);
                onChange?.(normalizedDate);
            }
        } catch {
            // Don't set an error while the user is still typing
            if (newValue.length >= dateFormat.length) {
                setError(`Please enter a valid date in ${dateFormat} format`);
            }
        }
    };

    // Handle input blur to validate the final input
    const handleInputBlur = () => {
        if (!inputValue) {
            setSelectedDate(null);
            onChange?.(null);
            return;
        }

        try {
            const parsedDate = parse(inputValue, dateFormat, new Date());
            if (!isValid(parsedDate)) {
                setError(`Please enter a valid date in ${dateFormat} format`);
                // Reset to the current value if invalid
                updateInputValueFromDate(selectedDate);
            } else {
                const normalizedDate = new Date(
                    parsedDate.setHours(0, 0, 0, 0),
                );
                setSelectedDate(normalizedDate);
                onChange?.(normalizedDate);
                updateInputValueFromDate(normalizedDate);
            }
        } catch {
            setError(`Please enter a valid date in ${dateFormat} format`);
            // Reset to the current value if invalid
            updateInputValueFromDate(selectedDate);
        }
    };

    return (
        <div className="relative">
            <div
                className={`flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-secondary transition-all duration-200 ${open ? 'border-primary/50 bg-muted/40 shadow-sm' : ''} ${hasLabel ? '' : 'py-3'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    {hasLabel && (
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {label}{' '}
                            {required && (
                                <span className="text-destructive">*</span>
                            )}
                        </p>
                    )}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder={placeholder || 'Pick a date'}
                        disabled={disabled}
                        className={`text-lg font-semibold bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/60 transition-colors duration-200 focus:text-primary ${hasLabel ? 'mt-1' : ''} ${className || ''}`}
                    />
                </div>
                <Popover open={open} onOpenChange={setOpen} modal={isInModal}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            disabled={disabled}
                        >
                            <CalendarIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={selectedDate || undefined}
                            onSelect={handleSelect}
                            initialFocus
                            defaultMonth={selectedDate || undefined}
                            fromDate={minDate}
                            toDate={maxDate}
                        />
                        {clearable && selectedDate && (
                            <div className="p-3 border-t border-border">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleSelect(null)}
                                >
                                    Clear
                                </Button>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
            {error && (
                <p className="text-sm text-destructive mt-1 px-4">{error}</p>
            )}
        </div>
    );
}
