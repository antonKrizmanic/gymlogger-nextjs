import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const defaultDateFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});

export function formatDate(
    input: Date | string,
    options?: Intl.DateTimeFormatOptions,
    locale?: string,
) {
    if (!input) {
        return '';
    }

    const date = typeof input === 'string' ? new Date(input) : input;
    const formatter = options
        ? new Intl.DateTimeFormat(locale, options)
        : defaultDateFormatter;

    return formatter.format(date);
}

export function formatNumber(
    value: number | null | undefined,
    locale?: string,
) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return '0';
    }

    return new Intl.NumberFormat(locale).format(value);
}
