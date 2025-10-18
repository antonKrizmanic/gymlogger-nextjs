'use client';

import { CalendarIcon } from 'lucide-react';
import { IconDatePicker } from '@/src/components/ui/icon-input';

interface DatePickerProps {
    value?: Date | null;
    onChange?: (date?: Date | null) => void;
    placeholder?: string;
    dateFormat?: string;
    className?: string;
    disabled?: boolean;
    clearable?: boolean;
    label?: string;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    isInModal?: boolean;
}

export function DatePicker({
    value,
    onChange,
    placeholder = '',
    dateFormat = 'dd.MM.yyyy.',
    className,
    disabled = false,
    clearable = true,
    label,
    required = false,
    minDate,
    maxDate,
    isInModal = false,
}: DatePickerProps) {
    return (
        <IconDatePicker
            icon={CalendarIcon}
            label={label}
            placeholder={placeholder || 'Choose a date'}
            value={value}
            onChange={onChange}
            dateFormat={dateFormat}
            className={className}
            disabled={disabled}
            clearable={clearable}
            required={required}
            minDate={minDate}
            maxDate={maxDate}
            isInModal={isInModal}
        />
    );
}
