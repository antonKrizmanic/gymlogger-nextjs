"use client";

import { format, isValid, parse } from "date-fns";
import { CalendarIcon, ChevronDown, LucideIcon } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";

import { cn } from "@/src/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type ControlSize = "compact" | "comfortable" | "spacious";

const controlStyles: Record<ControlSize, { wrapper: string; gap: string; iconBox: string; icon: string; input: string }> = {
  compact: {
    wrapper: "px-3 py-2",
    gap: "gap-3",
    iconBox: "size-9",
    icon: "size-4",
    input: "text-sm",
  },
  comfortable: {
    wrapper: "px-4 py-3",
    gap: "gap-4",
    iconBox: "size-10",
    icon: "size-[1.15rem]",
    input: "text-base",
  },
  spacious: {
    wrapper: "px-5 py-4",
    gap: "gap-5",
    iconBox: "size-11",
    icon: "size-[1.2rem]",
    input: "text-lg",
  },
};

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label?: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  size?: ControlSize;
}

interface IconSelectProps {
  icon: LucideIcon;
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  size?: ControlSize;
}

interface IconTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: LucideIcon;
  label?: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  size?: ControlSize;
}

interface IconDatePickerProps {
  icon?: LucideIcon;
  label?: string;
  placeholder?: string;
  value?: Date | null;
  onChange?: (date?: Date | null) => void;
  dateFormat?: string;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  clearable?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isInModal?: boolean;
  size?: ControlSize;
}

function getControlStyles(size: ControlSize) {
  return controlStyles[size] ?? controlStyles.comfortable;
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(function IconInput(
  { icon: Icon, label, className, wrapperClassName, size = "comfortable", disabled, ...props },
  ref
) {
  const hasLabel = Boolean(label);
  const styles = getControlStyles(size);

  return (
    <div
      className={cn(
        "group relative flex w-full items-center rounded-xl border border-border bg-muted/40 motion-base",
        "focus-within:border-ring focus-within:bg-background focus-within:shadow-card-hover focus-within:ring-2 focus-within:ring-ring/30 focus-within:ring-offset-2 focus-within:ring-offset-background",
        "transition-[transform,box-shadow,border-color]",
        styles.wrapper,
        styles.gap,
        disabled ? "cursor-not-allowed opacity-60" : "",
        wrapperClassName
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary/10 text-primary",
          styles.iconBox,
          disabled ? "text-muted-foreground" : ""
        )}
      >
        <Icon className={cn("shrink-0", styles.icon)} aria-hidden />
      </div>
      <div className="flex-1">
        {hasLabel ? (
          <p className="type-label text-muted-foreground">{label}</p>
        ) : null}
        <input
          ref={ref}
          {...props}
          disabled={disabled}
          className={cn(
            "w-full border-none bg-transparent p-0 outline-none placeholder:text-muted-foreground/60 text-foreground",
            "focus-visible:outline-none",
            styles.input,
            hasLabel && "mt-1",
            className
          )}
        />
      </div>
    </div>
  );
});

IconInput.displayName = "IconInput";

export function IconSelect({
  icon: Icon,
  label,
  placeholder = "Select option...",
  value,
  onValueChange,
  options,
  className,
  wrapperClassName,
  disabled = false,
  size = "comfortable",
}: IconSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const DROPDOWN_MAX_HEIGHT_PX = 240;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollAncestorsRef = React.useRef<HTMLElement[]>([]);
  const hasLabel = Boolean(label);
  const styles = getControlStyles(size);
  const dropdownId = React.useId();

  const selectedOption = options.find((opt) => opt.value === value);

  const updateDropdownPosition = React.useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const estimatedHeight = Math.min(DROPDOWN_MAX_HEIGHT_PX, Math.max(40, options.length * 40));
      const spaceBelow = window.innerHeight - rect.bottom;
      let top = rect.bottom + 6;

      if (spaceBelow < estimatedHeight && rect.top > estimatedHeight) {
        top = rect.top - estimatedHeight - 6;
      }

      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [options.length]);

  const addScrollListenersToAncestors = React.useCallback(() => {
    scrollAncestorsRef.current = [];
    let el = containerRef.current?.parentElement;
    const handler = () => updateDropdownPosition();

    while (el) {
      el.addEventListener("scroll", handler, { passive: true });
      scrollAncestorsRef.current.push(el as HTMLElement);
      el = el.parentElement;
    }

    return () => {
      scrollAncestorsRef.current.forEach((ancestor) => ancestor.removeEventListener("scroll", handler));
      scrollAncestorsRef.current = [];
    };
  }, [updateDropdownPosition]);

  React.useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      const handlePositionUpdate = () => updateDropdownPosition();
      window.addEventListener("scroll", handlePositionUpdate, { passive: true });
      window.addEventListener("resize", handlePositionUpdate);
      window.addEventListener("orientationchange", handlePositionUpdate);
      const cleanupAncestors = addScrollListenersToAncestors();

      return () => {
        window.removeEventListener("scroll", handlePositionUpdate);
        window.removeEventListener("resize", handlePositionUpdate);
        window.removeEventListener("orientationchange", handlePositionUpdate);
        cleanupAncestors();
      };
    }

    return undefined;
  }, [isOpen, updateDropdownPosition, addScrollListenersToAncestors]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", wrapperClassName)} ref={containerRef}>
      <div
        className={cn(
          "group relative flex w-full items-center rounded-xl border border-border bg-muted/40 motion-base",
          "focus-within:border-ring focus-within:bg-background focus-within:shadow-card-hover focus-within:ring-2 focus-within:ring-ring/30 focus-within:ring-offset-2 focus-within:ring-offset-background",
          styles.wrapper,
          styles.gap,
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          isOpen && !disabled ? "border-ring shadow-card-hover" : ""
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? dropdownId : undefined}
        onClick={handleToggle}
      >
        <div className={cn("flex items-center justify-center rounded-lg bg-primary/10 text-primary", styles.iconBox)}>
          <Icon className={cn("shrink-0", styles.icon)} aria-hidden />
        </div>
        <div className="flex-1">
          {hasLabel ? <p className="type-label text-muted-foreground">{label}</p> : null}
          <div
            className={cn(
              "flex min-h-[1.5rem] items-center text-foreground",
              !selectedOption ? "text-muted-foreground/70" : "",
              className,
              hasLabel && "mt-1",
              styles.input
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </div>
        </div>
        <ChevronDown
          className={cn("transition-transform duration-200 text-muted-foreground", isOpen && "rotate-180")}
          aria-hidden
        />
      </div>

      {isOpen && !disabled
        ? ReactDOM.createPortal(
            <>
              <div className="fixed inset-0 z-40 motion-overlay" onClick={() => setIsOpen(false)} />
              <div
                className={cn(
                  "motion-pop fixed z-50 max-h-60 overflow-auto rounded-lg border border-border bg-popover shadow-card-rest",
                  "p-2"
                )}
                id={dropdownId}
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                }}
                role="listbox"
              >
                {options.map((option) => {
                  const isActive = option.value === value;

                  return (
                    <button
                      type="button"
                      key={option.value}
                      role="option"
                      aria-selected={isActive}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-accent/70 text-accent-foreground" : "text-foreground"
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className={cn("flex items-center justify-center rounded-md bg-primary/10", "size-8")}> 
                        <Icon className="size-4 text-primary" aria-hidden />
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </>,
            document.body
          )
        : null}
    </div>
  );
}

export function IconTextarea({
  icon: Icon,
  label,
  className,
  wrapperClassName,
  size = "comfortable",
  disabled,
  ...props
}: IconTextareaProps) {
  const hasLabel = Boolean(label);
  const styles = getControlStyles(size);

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "group relative flex w-full items-start rounded-xl border border-border bg-muted/40 motion-base",
          "focus-within:border-ring focus-within:bg-background focus-within:shadow-card-hover focus-within:ring-2 focus-within:ring-ring/30 focus-within:ring-offset-2 focus-within:ring-offset-background",
          styles.wrapper,
          styles.gap,
          disabled ? "cursor-not-allowed opacity-60" : "",
          wrapperClassName
        )}
      >
        <div className={cn("mt-1 flex items-center justify-center rounded-lg bg-primary/10 text-primary", styles.iconBox)}>
          <Icon className={cn("shrink-0", styles.icon)} aria-hidden />
        </div>
        <div className="flex-1">
          {hasLabel ? <p className="type-label text-muted-foreground">{label}</p> : null}
          <textarea
            {...props}
            disabled={disabled}
            className={cn(
              "w-full resize-none border-none bg-transparent p-0 outline-none placeholder:text-muted-foreground/60 text-foreground",
              "focus-visible:outline-none",
              styles.input,
              hasLabel && "mt-1",
              className
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function IconDatePicker({
  icon: Icon = CalendarIcon,
  label,
  placeholder = "Pick a date",
  value,
  onChange,
  dateFormat = "dd.MM.yyyy.",
  className,
  wrapperClassName,
  disabled = false,
  clearable = true,
  required = false,
  minDate,
  maxDate,
  isInModal = false,
  size = "comfortable",
}: IconDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null | undefined>(value);
  const hasLabel = Boolean(label);
  const styles = getControlStyles(size);

  const updateInputValueFromDate = React.useCallback(
    (date: Date | null | undefined) => {
      if (date) {
        try {
          setInputValue(format(date, dateFormat));
        } catch {
          setInputValue("");
        }
      } else {
        setInputValue("");
      }
    },
    [dateFormat]
  );

  React.useEffect(() => {
    setSelectedDate(value);
    updateInputValueFromDate(value);
  }, [value, updateInputValueFromDate]);

  const handleSelect = (date?: Date | null) => {
    if (date) {
      const newDate = new Date(date.setHours(0, 0, 0, 0));
      setSelectedDate(newDate);
      updateInputValueFromDate(newDate);
      onChange?.(newDate);
    } else {
      setSelectedDate(null);
      setInputValue("");
      onChange?.(null);
    }
    setOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setError(null);

    if (!newValue) {
      setSelectedDate(null);
      onChange?.(null);
      return;
    }

    try {
      const parsedDate = parse(newValue, dateFormat, new Date());

      if (isValid(parsedDate)) {
        if (minDate && parsedDate < minDate) {
          setError(`Date must be after ${format(minDate, dateFormat)}`);
          return;
        }

        if (maxDate && parsedDate > maxDate) {
          setError(`Date must be before ${format(maxDate, dateFormat)}`);
          return;
        }

        const normalizedDate = new Date(parsedDate.setHours(0, 0, 0, 0));
        setSelectedDate(normalizedDate);
        onChange?.(normalizedDate);
      }
    } catch {
      if (newValue.length >= dateFormat.length) {
        setError(`Please enter a valid date in ${dateFormat} format`);
      }
    }
  };

  const handleInputBlur = () => {
    if (!inputValue) {
      setSelectedDate(null);
      onChange?.(null);
      return;
    }

    try {
      const parsedDate = parse(inputValue, dateFormat, new Date());
      if (!isValid(parsedDate)) {
        setError(`Please enter a valid date in ${dateFormat} format`);
        updateInputValueFromDate(selectedDate);
      } else {
        const normalizedDate = new Date(parsedDate.setHours(0, 0, 0, 0));
        setSelectedDate(normalizedDate);
        onChange?.(normalizedDate);
        updateInputValueFromDate(normalizedDate);
      }
    } catch {
      setError(`Please enter a valid date in ${dateFormat} format`);
      updateInputValueFromDate(selectedDate);
    }
  };

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "group relative flex w-full items-center rounded-xl border border-border bg-muted/40 motion-base",
          "focus-within:border-ring focus-within:bg-background focus-within:shadow-card-hover focus-within:ring-2 focus-within:ring-ring/30 focus-within:ring-offset-2 focus-within:ring-offset-background",
          styles.wrapper,
          styles.gap,
          disabled ? "cursor-not-allowed opacity-60" : "",
          wrapperClassName
        )}
      >
        <div className={cn("flex items-center justify-center rounded-lg bg-primary/10 text-primary", styles.iconBox)}>
          <Icon className={cn("shrink-0", styles.icon)} aria-hidden />
        </div>
        <div className="flex-1">
          {hasLabel ? (
            <p className="type-label text-muted-foreground">
              {label} {required ? <span className="text-destructive">*</span> : null}
            </p>
          ) : null}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full border-none bg-transparent p-0 outline-none placeholder:text-muted-foreground/60 text-foreground",
              styles.input,
              hasLabel && "mt-1",
              className
            )}
          />
        </div>
        <Popover open={open} onOpenChange={setOpen} modal={isInModal}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="motion-base text-muted-foreground hover:text-primary"
              disabled={disabled}
            >
              <CalendarIcon className="size-4" aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 motion-pop" align="end">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleSelect}
              initialFocus
              defaultMonth={selectedDate || undefined}
              fromDate={minDate}
              toDate={maxDate}
            />
            {clearable && selectedDate ? (
              <div className="border-t border-border p-3">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => handleSelect(null)}>
                  Clear
                </Button>
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>
      {error ? <p className="type-body-sm text-destructive">{error}</p> : null}
    </div>
  );
}
