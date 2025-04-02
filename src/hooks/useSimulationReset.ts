
import { MutableRefObject } from 'react';
import { Particle } from '@/types/simulation';
import { initializeIntentField } from '@/utils/intentFieldUtils';

interface UseSimulationResetProps {
  particlesRef: MutableRefObject<Particle[]>;
  intentFieldRef: MutableRefObject<number[][][]>;
  interactionsRef: MutableRefObject<number>;
  frameCountRef: MutableRefObject<number>;
  simulationTimeRef: MutableRefObject<number>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  processSimulationData: (particles: Particle[], intentField: number[][][], interactions: number, frameCount: number, simulationTime: number) => any;
  onStatsUpdate: (stats: any) => void;
}

export function useSimulationReset({
  particlesRef,
  intentFieldRef,
  interactionsRef,
  frameCountRef,
  simulationTimeRef,
  canvasRef,
  processSimulationData,
  onStatsUpdate
}: UseSimulationResetProps) {
  const resetSimulation = (): Particle[] => {
    // Reset counters
    interactionsRef.current = 0;
    frameCountRef.current = 0;
    simulationTimeRef.current = 0;
    
    // Clear particles
    particlesRef.current = [];
    
    // Re-initialize intent field
    if (canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      intentFieldRef.current = initializeIntentField(width, height);
    }
    
    // Update stats with reset state
    const stats = processSimulationData(
      particlesRef.current,
      intentFieldRef.current || [],
      interactionsRef.current,
      frameCountRef.current,
      simulationTimeRef.current
    );
    onStatsUpdate(stats);
    
    return particlesRef.current;
  };
  
  return { resetSimulation };
}
