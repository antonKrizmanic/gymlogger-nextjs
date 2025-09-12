"use client"
import * as React from "react"

import { cn } from "@/src/lib/utils"

interface DeviceMockupProps extends React.HTMLAttributes<HTMLDivElement> {
    glowClassName?: string
}

export function DeviceMockup({ className, glowClassName, children, ...props }: DeviceMockupProps) {
    return (
        <div className={cn("relative", className)} {...props}>
            <div className={cn("pointer-events-none absolute -inset-10 blur-3xl", glowClassName || "bg-gold-500/20 rounded-full")}></div>
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/70 p-3 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-primary-900/40">
                <div className="rounded-xl bg-white shadow-md ring-1 ring-black/5 dark:bg-primary-900 dark:ring-white/10">
                    {/* Camera notch */}
                    <div className="mx-auto h-6 w-24 rounded-b-2xl bg-black/80 dark:bg-black/60"></div>
                    {/* Screen */}
                    <div className="px-4 pb-6 pt-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}


