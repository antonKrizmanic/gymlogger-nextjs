"use client"

import { useEffect, useState } from "react"

export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState<boolean>(false)
	
	useEffect(() => {
		const mediaQuery = window.matchMedia(query)
		
		// Set initial value
		setMatches(mediaQuery.matches)
		
		// Create event listener for changes
		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches)
		}
		
		// Add the listener
		mediaQuery.addEventListener("change", handleChange)
		
		// Clean up listener on unmount
		return () => {
			mediaQuery.removeEventListener("change", handleChange)
		}
	}, [query])
	
	return matches
}
