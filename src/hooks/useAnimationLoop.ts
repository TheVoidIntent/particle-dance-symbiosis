
import { useRef, useEffect, useCallback } from 'react';
import { SimulationStats } from '@/types/simulation';

interface UseAnimationLoopProps {
  isRunning: boolean;
  onRender: (timestamp: number) => void;
  onUpdate?: (elapsedMs: number) => void;
  onStatsUpdate?: (stats: SimulationStats) => void;
  frameRate?: number;
}

export function useAnimationLoop({
  isRunning,
  onRender,
  onUpdate,
  onStatsUpdate,
  frameRate = 60
}: UseAnimationLoopProps) {
  const requestIdRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const frameTimeRef = useRef<number>(1000 / frameRate);
  const accumulatedTimeRef = useRef<number>(0);
  
  const animationLoop = useCallback((timestamp: number) => {
    if (!previousTimeRef.current) {
      previousTimeRef.current = timestamp;
    }
    
    const elapsedMs = timestamp - previousTimeRef.current;
    previousTimeRef.current = timestamp;
    
    accumulatedTimeRef.current += elapsedMs;
    
    // Update logic at fixed time steps
    while (accumulatedTimeRef.current >= frameTimeRef.current) {
      if (onUpdate) {
        onUpdate(frameTimeRef.current);
      }
      accumulatedTimeRef.current -= frameTimeRef.current;
    }
    
    // Render at animation frame rate
    onRender(timestamp);
    
    requestIdRef.current = requestAnimationFrame(animationLoop);
  }, [onRender, onUpdate]);
  
  useEffect(() => {
    if (isRunning) {
      requestIdRef.current = requestAnimationFrame(animationLoop);
    }
    
    return () => {
      cancelAnimationFrame(requestIdRef.current);
      previousTimeRef.current = 0;
      accumulatedTimeRef.current = 0;
    };
  }, [isRunning, animationLoop]);
  
  return {
    cancelAnimation: () => {
      cancelAnimationFrame(requestIdRef.current);
      previousTimeRef.current = 0;
    },
    getFrameRate: () => 1000 / frameTimeRef.current,
    setFrameRate: (newFrameRate: number) => {
      frameTimeRef.current = 1000 / newFrameRate;
    }
  };
}

export default useAnimationLoop;
