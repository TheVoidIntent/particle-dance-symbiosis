
import { MutableRefObject } from 'react';
import { Particle } from '@/utils/particleUtils';
import { SimulationStats } from './useSimulationData';

interface UseSimulationResetProps {
  particlesRef: MutableRefObject<Particle[]>;
  intentFieldRef: MutableRefObject<number[][]>;
  interactionsRef: MutableRefObject<number>;
  frameCountRef: MutableRefObject<number>;
  simulationTimeRef: MutableRefObject<number>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  processSimulationData: (
    particles: Particle[],
    intentField: number[][],
    interactions: number,
    frameCount: number,
    simulationTime: number
  ) => SimulationStats;
  onStatsUpdate: (stats: any) => void;
}

export const useSimulationReset = ({
  particlesRef,
  intentFieldRef,
  interactionsRef,
  frameCountRef,
  simulationTimeRef,
  canvasRef,
  processSimulationData,
  onStatsUpdate
}: UseSimulationResetProps) => {
  // Reset the simulation to its initial state
  const resetSimulation = (): Particle[] => {
    // Clear particles
    particlesRef.current = [];
    
    // Reset intent field (if it exists)
    if (intentFieldRef.current && intentFieldRef.current.length > 0) {
      const rows = intentFieldRef.current.length;
      const cols = intentFieldRef.current[0].length;
      
      intentFieldRef.current = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(0));
    }
    
    // Reset counters
    interactionsRef.current = 0;
    frameCountRef.current = 0;
    simulationTimeRef.current = 0;
    
    // Clear canvas if it exists
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    // Update stats
    const resetStats = processSimulationData(
      [],
      intentFieldRef.current || [],
      0,
      0,
      0
    );
    
    onStatsUpdate(resetStats);
    
    // Return the empty particles array
    return particlesRef.current;
  };
  
  return { resetSimulation };
};
