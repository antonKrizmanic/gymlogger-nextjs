import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white shadow-sm hover:bg-primary-700 active:bg-primary-800",
        destructive:
          "bg-error-600 text-white shadow-sm hover:bg-error-700 active:bg-error-800 focus-visible:ring-error-500",
        outline:
          "border-2 border-primary-600 bg-transparent text-primary-600 shadow-sm hover:bg-primary-50 hover:border-primary-700 active:bg-primary-100 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md",
        ghost:
          "text-primary-600 hover:bg-primary-50 hover:text-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-200",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200",
        accent:
          "bg-gold-500 text-white shadow-sm hover:bg-gold-600 active:bg-gold-700 focus-visible:ring-gold-500",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

