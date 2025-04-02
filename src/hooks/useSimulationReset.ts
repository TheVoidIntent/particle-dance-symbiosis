
import { useCallback } from 'react';
import { clearPersistedState, clearSimulationData } from '@/utils/dataExportUtils';
import { useToast } from '@/hooks/use-toast';
import { SimulationStats } from '@/hooks/useSimulationData';

type UseSimulationResetProps = {
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
  ) => SimulationStats;
  onStatsUpdate: (stats: SimulationStats) => void;
};

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
  const { toast } = useToast();
  
  // Explicitly return an array to match the expected type
  const resetSimulation = useCallback((): any[] => {
    clearPersistedState();
    clearSimulationData();
    particlesRef.current = [];
    interactionsRef.current = 0;
    frameCountRef.current = 0;
    simulationTimeRef.current = 0;
    
    if (canvasRef.current) {
      const { width, height } = canvasRef.current.getBoundingClientRect();
      const fieldResolution = 10;
      const fieldWidth = Math.ceil(width / fieldResolution);
      const fieldHeight = Math.ceil(height / fieldResolution);
      const fieldDepth = 10;
      
      const newField: number[][][] = [];
      
      for (let z = 0; z < fieldDepth; z++) {
        const plane: number[][] = [];
        for (let y = 0; y < fieldHeight; y++) {
          const row: number[] = [];
          for (let x = 0; x < fieldWidth; x++) {
            row.push(Math.random() * 2 - 1);
          }
          plane.push(row);
        }
        newField.push(plane);
      }
      
      intentFieldRef.current = newField;
    }
    
    const emptyStats = processSimulationData(
      particlesRef.current,
      intentFieldRef.current || [],
      interactionsRef.current || 0,
      frameCountRef.current || 0,
      simulationTimeRef.current || 0
    );
    onStatsUpdate(emptyStats);
    
    toast({
      title: "Simulation Reset",
      description: "The simulation has been completely reset.",
      variant: "default",
    });
    
    return []; // Explicitly return an empty array
  }, [
    toast, 
    particlesRef, 
    interactionsRef, 
    frameCountRef, 
    simulationTimeRef, 
    intentFieldRef, 
    processSimulationData, 
    onStatsUpdate,
    canvasRef
  ]);

  return { resetSimulation };
}
