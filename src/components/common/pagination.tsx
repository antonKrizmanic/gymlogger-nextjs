import { CSSProperties, memo, useCallback, useMemo } from "react";

import { cn } from "@/src/lib/utils";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
const DEFAULT_PAGE_SIZE = 12;

type PaginationDensity = "compact" | "comfortable" | "spacious";

type StickyPosition = "top" | "bottom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (event: string) => void;
  density?: PaginationDensity;
  sticky?: boolean;
  stickyPosition?: StickyPosition;
  stickyOffset?: number | string;
  isLoading?: boolean;
  className?: string;
}

const densityLayout: Record<PaginationDensity, { container: string; controlGap: string; buttonSize: "sm" | "default" | "lg" }> = {
  compact: { container: "gap-3 py-2", controlGap: "gap-1.5", buttonSize: "sm" },
  comfortable: { container: "gap-4 py-3", controlGap: "gap-2", buttonSize: "default" },
  spacious: { container: "gap-5 py-4", controlGap: "gap-3", buttonSize: "lg" },
};

function getOffsetValue(offset?: number | string) {
  if (typeof offset === "number") {
    return `${offset}px`;
  }

  return offset;
}

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageSizeChange,
  density = "comfortable",
  sticky,
  stickyPosition = "bottom",
  stickyOffset,
  isLoading,
  className,
}: PaginationProps) {
  const { container, controlGap, buttonSize } = densityLayout[density];

  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: number[] = [];

    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    return range;
  }, [currentPage, totalPages]);

  const handlePrevious = useCallback(() => {
    onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(currentPage + 1);
  }, [currentPage, onPageChange]);

  const navigationState = useMemo(
    () => ({
      canGoPrevious: currentPage > 0,
      canGoNext: currentPage < totalPages - 1,
    }),
    [currentPage, totalPages]
  );

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <div className="h-10 w-full rounded-xl border border-border bg-muted/50 motion-base animate-pulse" />
        <div className="h-10 w-40 rounded-xl border border-border bg-muted/50 motion-base animate-pulse" />
      </div>
    );
  }

  if (totalPages <= 1) {
    return null;
  }

  const stickyStyle = sticky
    ? {
        [stickyPosition]: getOffsetValue(stickyOffset) ?? "var(--space-md)",
      }
    : undefined;

  return (
    <div
      className={cn(
        "motion-base",
        "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        container,
        sticky &&
          "sticky z-10 rounded-xl border border-border bg-background/95 px-4 shadow-card-rest backdrop-blur",
        className
      )}
      style={stickyStyle as CSSProperties}
    >
      <div className={cn("flex flex-wrap items-center", controlGap)}>
        <Button
          variant="outline"
          size={buttonSize}
          onClick={handlePrevious}
          disabled={!navigationState.canGoPrevious}
          className="motion-base"
        >
          Previous
        </Button>
        {pageNumbers.map((page, index, array) => {
          const isActive = page === currentPage;
          const previousPage = array[index - 1];

          return (
            <div key={page} className="flex items-center">
              {index > 0 && previousPage !== page - 1 ? (
                <span className="px-2 text-muted-foreground">…</span>
              ) : null}
              <Button
                variant={isActive ? "default" : "outline"}
                size={buttonSize}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={cn("motion-base", isActive && "shadow-button-hover")}
              >
                {page + 1}
              </Button>
            </div>
          );
        })}
        <Button
          variant="outline"
          size={buttonSize}
          onClick={handleNext}
          disabled={!navigationState.canGoNext}
          className="motion-base"
        >
          Next
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="pageSize" className="type-body-sm text-muted-foreground">
          Items per page
        </label>
        <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
          <SelectTrigger
            id="pageSize"
            className={cn(
              "w-[110px] bg-background text-foreground",
              buttonSize === "sm" && "h-9 text-sm",
              buttonSize === "default" && "h-10",
              buttonSize === "lg" && "h-11 text-base"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="motion-pop">
            {ITEMS_PER_PAGE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

