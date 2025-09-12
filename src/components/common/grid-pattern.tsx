"use client"
import * as React from "react"

import { cn } from "@/src/lib/utils"

interface GridPatternProps extends React.HTMLAttributes<HTMLDivElement> {
    density?: number
}

export function GridPattern({ className, density = 24, ...props }: GridPatternProps) {
    return (
        <div
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]",
                className
            )}
            {...props}
        >
            <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width={density} height={density} patternUnits="userSpaceOnUse">
                        <path d={`M ${density} 0 L 0 0 0 ${density}`} fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" className="text-primary-900/30" />
            </svg>
        </div>
    )
}


