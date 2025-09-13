"use client"

import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import * as React from "react"

import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Label } from "@/src/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { cn } from "@/src/lib/utils"

interface DatePickerProps {
  value?: Date | null
  onChange?: (date?: Date | null) => void
  placeholder?: string
  dateFormat?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
  label?: string
  labelClassName?: string
  required?: boolean
  id?: string
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  dateFormat = "PPP",
  className,
  disabled = false,
  clearable = false,
  label,
  labelClassName,
  required = false,
  id = "date-picker",
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Handle date selection
  const handleSelect = (date?: Date | null) => {
    onChange?.(date)
    setOpen(false) // Close the popover when a date is selected
  }

  // Format the date for display or show placeholder
  const displayValue = React.useMemo(() => {
    if (!value) return placeholder
    try {
      return format(value, dateFormat)
    } catch (error) {
      console.error("Error formatting date:", error)
      return placeholder
    }
  }, [value, dateFormat, placeholder])

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            labelClassName
          )}
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full h-10 justify-start text-left font-normal border-2 shadow-sm transition-all duration-200",
              "hover:border-primary/50 hover:shadow-md",
              "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled}
          >
            <div className="flex items-center w-full">
              <div className="flex items-center flex-1">
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                <span className="truncate">{displayValue}</span>
              </div>
              {clearable && value && !disabled && (
                <div className="ml-2 flex-shrink-0">
                  <div
                    className="p-1 rounded-full hover:bg-muted transition-colors duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(null);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </div>
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-2 shadow-xl rounded-lg"
          align="start"
          sideOffset={4}
        >
          <div className="p-1">
            <Calendar
              mode="single"
              selected={value || undefined}
              onSelect={handleSelect}
              startMonth={minDate}
              endMonth={maxDate}
              className="rounded-md"
            />
          </div>
          {clearable && value && (
            <div className="p-3 border-t border-border bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => handleSelect(null)}
              >
                <X className="mr-2 h-3 w-3" />
                Clear Date
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

