import type { CSSProperties } from "react";

import { cn } from "@/src/lib/utils";

import { IconInput } from "@/src/components/ui/icon-input";
import { Search } from "lucide-react";

type SearchDensity = "compact" | "comfortable" | "spacious";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  density?: SearchDensity;
  isSticky?: boolean;
  stickyOffset?: number | string;
  isLoading?: boolean;
  skeletonWidth?: number | string;
}

function getOffsetValue(offset?: number | string) {
  if (typeof offset === "number") {
    return `${offset}px`;
  }

  return offset;
}

const densityMap: Record<SearchDensity, "compact" | "comfortable" | "spacious"> = {
  compact: "compact",
  comfortable: "comfortable",
  spacious: "spacious",
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
  density = "comfortable",
  isSticky,
  stickyOffset,
  isLoading,
  skeletonWidth,
}: SearchBarProps) {
  const stickyStyle = isSticky
    ? {
        top: getOffsetValue(stickyOffset) ?? "var(--space-md)",
      }
    : undefined;

  const skeletonStyle: CSSProperties | undefined = isLoading
    ? {
        ...(stickyStyle ?? {}),
        width:
          skeletonWidth !== undefined
            ? typeof skeletonWidth === "number"
              ? `${skeletonWidth}px`
              : skeletonWidth
            : undefined,
      }
    : undefined;

  if (isLoading) {
    return (
      <div
        className={cn(
          "motion-base h-11 w-full rounded-xl border border-border bg-muted/40 animate-pulse",
          className,
          isSticky && "sticky z-20 backdrop-blur"
        )}
        style={skeletonStyle}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full",
        isSticky && "sticky z-20 backdrop-blur",
        className
      )}
      style={stickyStyle as CSSProperties}
    >
      <IconInput
        icon={Search}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        size={densityMap[density]}
        wrapperClassName="shadow-card-rest"
      />
    </div>
  );
}
