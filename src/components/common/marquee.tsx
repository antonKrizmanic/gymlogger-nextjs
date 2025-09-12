"use client"
import * as React from "react"

import { cn } from "@/src/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
    speedMs?: number
    pauseOnHover?: boolean
}

export function Marquee({ className, speedMs = 25000, pauseOnHover = true, children, ...props }: MarqueeProps) {
    return (
        <div className={cn("relative overflow-hidden", className)} {...props}>
            <div className={cn("flex whitespace-nowrap will-change-transform", pauseOnHover && "hover:[animation-play-state:paused]")}
                style={{ animation: `marquee ${speedMs}ms linear infinite` }}>
                <div className="flex gap-8 pr-8">{children}</div>
                <div className="flex gap-8 pr-8" aria-hidden>{children}</div>
            </div>
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    )
}


