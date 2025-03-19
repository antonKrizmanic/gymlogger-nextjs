import { ReactNode } from 'react';

interface GridProps<T> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    isLoading?: boolean;
    emptyMessage?: string;
}

export function Grid<T>({ items, renderItem, isLoading, emptyMessage = 'No items found' }: GridProps<T>) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500 dark:border-gray-100"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
                <div key={index}>
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
} 