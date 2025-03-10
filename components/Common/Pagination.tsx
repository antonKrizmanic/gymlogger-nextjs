import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
const DEFAULT_PAGE_SIZE = 12;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize = DEFAULT_PAGE_SIZE,
    onPageSizeChange    
}: PaginationProps) {
    const getPageNumbers = () => {
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
    };

    return (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Pagination buttons */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={cn(
                        'px-4 py-2 rounded-md',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'text-gray-700 dark:text-gray-300',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'cursor-pointer',
                        'hover:bg-gray-50 dark:hover:bg-slate-700'
                    )}
                >
                    Previous
                </button>
                {getPageNumbers().map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                        return [
                            <span key={`ellipsis-${page}`} className="px-4 py-2">...</span>,
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={cn(
                                    'px-4 py-2 rounded-md',
                                    'border',
                                    currentPage === page
                                        ? 'bg-primary-500 text-white border-primary-500'
                                        : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer'
                                )}
                            >
                                {page + 1}
                            </button>
                        ];
                    }
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={cn(
                                'px-4 py-2 rounded-md',
                                'border',
                                currentPage === page
                                    ? 'bg-gray-400 dark:bg-slate-900 text-white border-primary-500'
                                    : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer'
                            )}
                        >
                            {page + 1}
                        </button>
                    );
                })}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className={cn(
                        'px-4 py-2 rounded-md',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'text-gray-700 dark:text-gray-300',
                        'cursor-pointer',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'hover:bg-gray-50 dark:hover:bg-slate-700'
                    )}
                >
                    Next
                </button>
            </div>

            {/* Page size selector */}
            <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-gray-600 dark:text-gray-400">
                    Items per page:
                </label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={onPageSizeChange}
                    className={cn(
                        'px-3 py-2 rounded-lg',
                        'bg-white dark:bg-slate-800',
                        'border border-gray-300 dark:border-gray-700',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500',
                        'text-gray-900 dark:text-white'
                    )}
                >
                    {ITEMS_PER_PAGE_OPTIONS.map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
} 