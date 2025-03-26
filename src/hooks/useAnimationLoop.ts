
import { useCallback, useRef, useEffect } from 'react';
import { 
  updateIntentField, 
  createFieldFromParticles 
} from '@/utils/fieldUtils';
import { AnomalyEvent } from '@/utils/particleUtils';
import { SimulationStats } from './useSimulationData';

interface UseAnimationLoopProps {
  running: boolean;
  isInitialized: boolean;
  viewMode: '2d' | '3d';
  renderMode: 'particles' | 'field' | 'density' | 'combined';
  probabilisticIntent: boolean;
  intentFluctuationRate: number;
  isAnimatingRef: React.MutableRefObject<boolean>;
  particlesRef: React.MutableRefObject<any[]>;
  intentFieldRef: React.MutableRefObject<number[][][]>;
  dimensionsRef: React.MutableRefObject<{ width: number; height: number }>;
  frameCountRef: React.MutableRefObject<number>;
  simulationTimeRef: React.MutableRefObject<number>;
  interactionsRef: React.MutableRefObject<number>;
  updateParticles: () => any[];
  processSimulationData: (
    particles: any[],
    intentField: number[][][],
    interactionsCount: number,
    frameCount: number, 
    simulationTime: number
  ) => SimulationStats;
  renderSimulation: (
    ctx: CanvasRenderingContext2D | null,
    particles: any[],
    intentField: number[][][],
    dimensions: { width: number; height: number },
    renderMode: 'particles' | 'field' | 'density' | 'combined',
    viewMode: '2d' | '3d'
  ) => void;
  detectSimulationAnomalies: (particles: any[]) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dataExportOptions: {
    autoExport: boolean;
    format: 'csv' | 'json';
  };
  handleExportData: () => void;
}

export function useAnimationLoop({
  running,
  isInitialized,
  viewMode,
  renderMode,
  probabilisticIntent,
  intentFluctuationRate,
  isAnimatingRef,
  particlesRef,
  intentFieldRef,
  dimensionsRef,
  frameCountRef,
  simulationTimeRef,
  interactionsRef,
  updateParticles,
  processSimulationData,
  renderSimulation,
  detectSimulationAnomalies,
  canvasRef,
  dataExportOptions,
  handleExportData
}: UseAnimationLoopProps) {
  const animationRef = useRef<number>(0);

  // Update intent field based on particles and simulation state
  const updateSimulationIntentField = useCallback(() => {
    intentFieldRef.current = updateIntentField(
      intentFieldRef.current, 
      intentFluctuationRate, 
      probabilisticIntent
    );
    
    if (frameCountRef.current % 100 === 0) {
      const particleField = createFieldFromParticles(
        particlesRef.current, 
        { 
          width: dimensionsRef.current.width, 
          height: dimensionsRef.current.height, 
          depth: 10 
        },
        dimensionsRef.current.width / intentFieldRef.current[0][0].length
      );
      
      const blendedField = intentFieldRef.current.map((plane, z) => 
        plane.map((row, y) => 
          row.map((value, x) => 
            value * 0.7 + particleField[z][y][x] * 0.3
          )
        )
      );
      
      intentFieldRef.current = blendedField;
    }
  }, [intentFieldRef, frameCountRef, dimensionsRef, particlesRef, intentFluctuationRate, probabilisticIntent]);

  // Animation loop function
  const startAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    
    const animate = () => {
      if (!running) {
        isAnimatingRef.current = false;
        return;
      }
      
      frameCountRef.current += 1;
      simulationTimeRef.current += 1;
      
      particlesRef.current = updateParticles();
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        renderSimulation(
          ctx, 
          particlesRef.current, 
          intentFieldRef.current, 
          dimensionsRef.current, 
          renderMode, 
          viewMode
        );
      }
      
      if (frameCountRef.current % 30 === 0) {
        // Process simulation data and update stats
        processSimulationData(
          particlesRef.current,
          intentFieldRef.current,
          interactionsRef.current,
          frameCountRef.current,
          simulationTimeRef.current
        );
        
        // Detect anomalies
        detectSimulationAnomalies(particlesRef.current);
      }
      
      if (dataExportOptions.autoExport && frameCountRef.current % 3000 === 0) {
        handleExportData();
      }
      
      animationRef.current = window.requestAnimationFrame(animate);
    };
    
    animationRef.current = window.requestAnimationFrame(animate);
  }, [
    running, 
    isAnimatingRef, 
    frameCountRef, 
    simulationTimeRef, 
    particlesRef, 
    canvasRef, 
    renderSimulation, 
    updateParticles, 
    processSimulationData, 
    detectSimulationAnomalies, 
    dataExportOptions, 
    handleExportData, 
    intentFieldRef, 
    interactionsRef, 
    dimensionsRef, 
    viewMode, 
    renderMode
  ]);

  // Effect to manage animation loop
  useEffect(() => {
    if (running && isInitialized) {
      if (!isAnimatingRef.current) {
        startAnimation();
      }
      
      const animationCheckInterval = setInterval(() => {
        if (running && !isAnimatingRef.current) {
          startAnimation();
        }
      }, 1000);

      // Periodically update the intent field
      const intentFieldInterval = setInterval(() => {
        updateSimulationIntentField();
      }, 1000);
      
      return () => {
        clearInterval(animationCheckInterval);
        clearInterval(intentFieldInterval);
        cancelAnimationFrame(animationRef.current);
        isAnimatingRef.current = false;
      };
    } else if (!running) {
      cancelAnimationFrame(animationRef.current);
      isAnimatingRef.current = false;
    }
  }, [running, isInitialized, startAnimation, isAnimatingRef, updateSimulationIntentField]);

  return { startAnimation };
}
