'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for chart line animations
 * @param delay - Delay before starting the animation in ms
 * @param duration - Duration of the animation in ms
 * @returns Animation properties for Recharts Line component
 */
export function useChartAnimation(delay: number = 0, duration: number = 1500) {
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, delay + duration);
    
    return () => {
      clearTimeout(timer);
    };
  }, [delay, duration]);

  return {
    animationBegin: delay,
    animationDuration: duration,
    animationEasing: "ease-out",
    isAnimating,
  };
}

/**
 * Custom hook for creating a line drawing animation effect
 * @param totalDuration - Total duration of all animations in ms
 * @param numberOfLines - Number of lines to animate
 * @returns Animation configs for each line with staggered timing
 */
export function useLineDrawingAnimation(totalDuration: number = 2000, numberOfLines: number = 2) {
  const [animations, setAnimations] = useState<Array<{
    animationBegin: number;
    animationDuration: number;
    animationEasing: string;
    strokeDasharray: string;
  }>>([]);

  useEffect(() => {
    const staggerDelay = totalDuration * 0.2;
    const singleAnimationDuration = totalDuration * 0.8;
    
    const newAnimations = Array.from({ length: numberOfLines }).map((_, index) => ({
      animationBegin: index * staggerDelay,
      animationDuration: singleAnimationDuration,
      animationEasing: "ease-in-out",
      strokeDasharray: "0 0", // This ensures the line is drawn from start to end
    }));
    
    setAnimations(newAnimations);
  }, [totalDuration, numberOfLines]);

  return animations;
}