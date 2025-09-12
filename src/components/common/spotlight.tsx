"use client"
import * as React from "react"

import { cn } from "@/src/lib/utils"

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
    colorClass?: string
}

export function Spotlight({ className, colorClass = "from-gold-500/30", ...props }: SpotlightProps) {
    return (
        <div
            aria-hidden
            className={cn(
                "pointer-events-none absolute -inset-px bg-radial from-transparent via-transparent to-transparent",
                className
            )}
            {...props}
        >
            <div className={cn("absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-3xl", `bg-gradient-to-b ${colorClass}`)} />
        </div>
    )
}


