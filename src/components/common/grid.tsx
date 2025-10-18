import { memo, type ReactNode, useMemo } from 'react';

interface GridProps<T> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    isLoading?: boolean;
    emptyMessage?: string;
    keyExtractor?: (item: T, index: number) => string;
}

function GridComponent<T>({
    items,
    renderItem,
    isLoading,
    emptyMessage = 'No items found',
    keyExtractor,
}: GridProps<T>) {
    // Memoize rendered items to prevent unnecessary re-renders
    const renderedItems = useMemo(() => {
        return items.map((item, index) => {
            const key = keyExtractor ? keyExtractor(item, index) : index;
            return <div key={key}>{renderItem(item)}</div>;
        });
    }, [items, renderItem, keyExtractor]);

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
                <p className="text-gray-500 dark:text-gray-400">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderedItems}
        </div>
    );
}

export const Grid = memo(GridComponent) as typeof GridComponent;
