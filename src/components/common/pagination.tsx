import { memo, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
const DEFAULT_PAGE_SIZE = 12;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (event: string) => void;
}

export const Pagination = memo(function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize = DEFAULT_PAGE_SIZE,
    onPageSizeChange
}: PaginationProps) {
    // Memoize page numbers calculation
    const pageNumbers = useMemo(() => {
        const delta = 2;
        const range = [];
        for (let i = 0; i < totalPages; i++) {
            if (
                i === 0 || // First page
                i === totalPages - 1 || // Last page
                (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
            ) {
                range.push(i);
            }
        }
        return range;
    }, [currentPage, totalPages]);

    // Memoize navigation handlers
    const handlePrevious = useCallback(() => {
        onPageChange(currentPage - 1);
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
        onPageChange(currentPage + 1);
    }, [currentPage, onPageChange]);

    // Memoize navigation state
    const navigationState = useMemo(() => ({
        canGoPrevious: currentPage > 0,
        canGoNext: currentPage < totalPages - 1,
    }), [currentPage, totalPages]);

    return (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Pagination buttons */}
            <div className="flex justify-center gap-2">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={!navigationState.canGoPrevious}>
                    Previous
                </Button>
                {pageNumbers.map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                        return [
                            <span key={`ellipsis-${page}`} className="px-4 py-2">...</span>,
                            <Button
                                variant="outline"
                                key={page}
                                onClick={() => onPageChange(page)}>
                                {page + 1}
                            </Button>
                        ];
                    }
                    return (
                        <Button
                            variant="outline"
                            key={page}
                            onClick={() => onPageChange(page)}>
                            {page + 1}
                        </Button>
                    );
                })}
                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={!navigationState.canGoNext}>
                    Next
                </Button>
            </div>

            {/* Page size selector */}
            <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-gray-600 dark:text-gray-400">
                    Items per page:
                </label>
                <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
                    <SelectTrigger className="bg-white text-black dark:text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {ITEMS_PER_PAGE_OPTIONS.map(size => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}) 