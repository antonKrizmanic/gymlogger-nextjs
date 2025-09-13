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
        <Label htmlFor={id} className={cn("text-xs font-medium text-muted-foreground uppercase tracking-wide", labelClassName)}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant={"outline"}
            className={cn(
              "w-full h-10 justify-between text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayValue}
            </div>
            {clearable && value && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(null);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={handleSelect}
            startMonth={minDate}
            endMonth={maxDate}
          />
          {clearable && value && (
            <div className="p-3 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => handleSelect(null)}>
                Clear Date
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

