'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state initially
    setMatches(media.matches);
    
    // Define callback for media query changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add the callback as a listener
    media.addEventListener('change', listener);
    
    // Remove the listener when component unmounts
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}