
import React, { useRef, useEffect, useCallback } from 'react';
import { useParticleSimulation } from '@/hooks/useParticleSimulation';
import { useSimulationData } from '@/hooks/useSimulationData';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';
import { SimulationControlButtons } from '@/components/SimulationControlButtons';
import { AnomalyEvent } from '@/utils/particleUtils';
import { clearPersistedState, clearSimulationData } from '@/utils/dataExportUtils';
import { useToast } from "@/hooks/use-toast";

type ParticleCanvasProps = {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  running: boolean;
  renderMode?: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles?: boolean;
  energyConservation?: boolean;
  probabilisticIntent?: boolean;
  onStatsUpdate: (stats: any) => void;
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void;
};

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  intentFluctuationRate,
  maxParticles,
  learningRate,
  particleCreationRate,
  viewMode,
  running,
  renderMode = 'particles',
  useAdaptiveParticles = false,
  energyConservation = false,
  probabilisticIntent = false,
  onStatsUpdate,
  onAnomalyDetected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize simulation hooks
  const {
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isInitialized,
    isAnimatingRef,
    initializeSimulation,
    updateParticles,
    createNewParticles,
    detectSimulationAnomalies
  } = useParticleSimulation(
    {
      intentFluctuationRate,
      maxParticles,
      learningRate,
      particleCreationRate,
      viewMode,
      useAdaptiveParticles,
      energyConservation,
      probabilisticIntent
    },
    running,
    onAnomalyDetected
  );

  const {
    dataCollectionActiveRef,
    dataExportOptions,
    processSimulationData,
    handleExportData,
    toggleDataCollection
  } = useSimulationData(onStatsUpdate);

  const { renderSimulation } = useCanvasRenderer();

  // Initialize canvas and start simulation
  useEffect(() => {
    if (!canvasRef.current) return;
    initializeSimulation(canvasRef.current);
    
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeSimulation, dimensionsRef]);

  // Manage particle creation based on simulation parameters
  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const createParticlesInterval = setInterval(() => {
      createNewParticles();
    }, 1000 / particleCreationRate);
    
    return () => clearInterval(createParticlesInterval);
  }, [running, isInitialized, createNewParticles, particleCreationRate, intentFieldRef]);

  // Animation loop
  useAnimationLoop({
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
  });

  // Reset simulation state
  const resetSimulation = useCallback(() => {
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
    
    toast({
      title: "Simulation Reset",
      description: "The simulation has been completely reset.",
      variant: "default",
    });
  }, [toast, particlesRef, interactionsRef, frameCountRef, simulationTimeRef, intentFieldRef]);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black/90"
      />
      
      <SimulationControlButtons 
        dataCollectionActive={dataCollectionActiveRef.current}
        onExportData={handleExportData}
        onToggleDataCollection={toggleDataCollection}
        onResetSimulation={resetSimulation}
      />
    </div>
  );
};
