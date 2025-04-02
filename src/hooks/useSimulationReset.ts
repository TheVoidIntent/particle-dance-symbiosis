import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseSimulationResetProps {
  particlesRef: React.MutableRefObject<any[]>;
  intentFieldRef: React.MutableRefObject<number[][][]>;
  interactionsRef: React.MutableRefObject<number>;
  frameCountRef: React.MutableRefObject<number>;
  simulationTimeRef: React.MutableRefObject<number>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  processSimulationData: (
    particles: any[],
    intentField: number[][][],
    interactionsCount: number,
    frameCount: number,
    simulationTime: number
  ) => any;
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
  const resetSimulation = useCallback((): any[] => {
    // Reset particles
    particlesRef.current = [];
    
    // Reset interactions
    interactionsRef.current = 0;
    
    // Reset frame count and simulation time but don't reset intent field
    // as we want to keep the last field state
    frameCountRef.current = 0;
    simulationTimeRef.current = 0;
    
    // Clear canvas if it exists
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    // Process and update stats
    const updatedStats = processSimulationData(
      particlesRef.current,
      intentFieldRef.current,
      interactionsRef.current,
      frameCountRef.current,
      simulationTimeRef.current
    );
    
    onStatsUpdate(updatedStats);
    
    toast.success("Simulation reset", {
      description: "Particles cleared, counters reset. Intent field preserved."
    });
    
    // Return the reset particles array
    return particlesRef.current;
  }, [
    particlesRef,
    intentFieldRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    canvasRef,
    processSimulationData,
    onStatsUpdate
  ]);
  
  return { resetSimulation };
}
