import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { buttonVariants } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-3",
        month: "flex flex-col gap-5",
        caption: "flex justify-center pb-2 relative items-center w-full",
        caption_label: "text-base font-semibold text-foreground",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-card p-0 border-2 shadow-sm hover:shadow-md hover:border-primary/60 hover:bg-primary/5 transition-all duration-200"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell:
          "text-muted-foreground rounded-lg w-9 h-9 font-medium text-xs uppercase tracking-wider flex items-center justify-center",
        row: "flex w-full gap-1 mb-1",
        day: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-lg [&:has(>.day-range-start)]:rounded-l-lg first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg"
            : ""
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "w-9 h-9 p-0 font-medium text-sm rounded-lg border border-transparent aria-selected:opacity-100",
          "hover:bg-primary/10 hover:text-primary hover:border-primary/20 hover:shadow-sm",
          "transition-all duration-150"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:rounded-lg",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:rounded-lg",
        day_selected:
          "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-lg",
        day_today: "bg-primary/15 text-primary font-bold border-2 border-primary/40 rounded-lg shadow-sm",
        day_outside:
          "day-outside text-muted-foreground/60 aria-selected:text-muted-foreground/60",
        disabled: "text-muted-foreground/40 opacity-40",
        day_range_middle:
          "aria-selected:bg-primary/20 aria-selected:text-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft {...props} />;
          }
          return <ChevronRight {...props} />;
        },
      }}
      {...props}
    />
  )
}

export { Calendar }

