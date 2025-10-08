import { ReactNode, memo, useMemo } from "react";

import { cn } from "@/src/lib/utils";

type GridDensity = "compact" | "comfortable" | "spacious";

interface GridProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string;
  density?: GridDensity;
  skeletonCount?: number;
  renderSkeletonItem?: (index: number) => ReactNode;
  controls?: ReactNode;
  controlsSticky?: boolean;
  controlsOffset?: number | string;
  className?: string;
}

const densityClassMap: Record<GridDensity, string> = {
  compact: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4",
  comfortable: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
  spacious: "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8",
};

function getOffsetValue(offset?: number | string) {
  if (typeof offset === "number") {
    return `${offset}px`;
  }

  return offset;
}

function GridComponent<T>({
  items,
  renderItem,
  isLoading,
  emptyMessage = "No items found",
  keyExtractor,
  density = "comfortable",
  skeletonCount,
  renderSkeletonItem,
  controls,
  controlsSticky,
  controlsOffset,
  className,
}: GridProps<T>) {
  const resolvedSkeletonCount = skeletonCount ?? Math.max(items.length, 6);

  const renderedItems = useMemo(() => {
    return items.map((item, index) => {
      const key = keyExtractor ? keyExtractor(item, index) : index;
      return <div key={key}>{renderItem(item)}</div>;
    });
  }, [items, renderItem, keyExtractor]);

  const skeletonItems = useMemo(() => {
    if (!isLoading) {
      return null;
    }

    const skeletons = Array.from({ length: resolvedSkeletonCount }, (_, index) => {
      const skeletonContent = renderSkeletonItem ? (
        renderSkeletonItem(index)
      ) : (
        <div className="h-40 rounded-2xl border border-border bg-muted/40 motion-base animate-pulse" />
      );

      return (
        <div key={`skeleton-${index}`} aria-hidden>
          {skeletonContent}
        </div>
      );
    });

    return skeletons;
  }, [isLoading, renderSkeletonItem, resolvedSkeletonCount]);

  if (!isLoading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="type-body-md text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {controls ? (
        <div
          className={cn(
            "z-[1] flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/90 px-4 py-3 shadow-card-rest motion-base",
            controlsSticky && "sticky backdrop-blur"
          )}
          style={controlsSticky ? { top: getOffsetValue(controlsOffset) ?? "var(--space-md)" } : undefined}
        >
          {controls}
        </div>
      ) : null}

      <div className={cn("grid", densityClassMap[density])}>
        {isLoading ? skeletonItems : renderedItems}
      </div>
    </div>
  );
}

export const Grid = memo(GridComponent) as typeof GridComponent;
