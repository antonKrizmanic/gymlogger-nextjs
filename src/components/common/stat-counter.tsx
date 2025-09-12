"use client"
import * as React from "react"

interface StatCounterProps {
    value: number
    suffix?: string
    durationMs?: number
    className?: string
}

export function StatCounter({ value, suffix = "", durationMs = 1500, className }: StatCounterProps) {
    const [display, setDisplay] = React.useState(0)
    React.useEffect(() => {
        const start = performance.now()
        let raf = 0
        const step = (now: number) => {
            const progress = Math.min(1, (now - start) / durationMs)
            setDisplay(Math.floor(value * progress))
            if (progress < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
        return () => cancelAnimationFrame(raf)
    }, [value, durationMs])
    return <span className={className}>{display.toLocaleString()}{suffix}</span>
}


