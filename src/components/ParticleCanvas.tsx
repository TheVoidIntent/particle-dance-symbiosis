
import React, { useCallback } from 'react';
import { useParticleSimulation, InflationEvent } from '@/hooks/simulation';
import { useSimulationData } from '@/hooks/useSimulationData';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';
import { SimulationControlButtons } from '@/components/SimulationControlButtons';
import { AnomalyEvent } from '@/utils/particleUtils';
import { clearPersistedState, clearSimulationData } from '@/utils/dataExportUtils';
import { useToast } from "@/hooks/use-toast";
import { ParticleDisplay } from '@/components/simulation/ParticleDisplay';
import { useInflationEvents } from '@/hooks/useInflationEvents';
import { useParticleManagement } from '@/hooks/useParticleManagement';

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
  const { toast } = useToast();
  
  // Setup inflation handling
  const { 
    showInflationBanner, 
    latestInflation, 
    handleInflationDetected 
  } = useInflationEvents();

  // Setup particle management
  const {
    canvasRef,
    particleCount,
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    frameCountRef,
    simulationTimeRef,
    interactionsRef,
    isInitialized,
    isAnimatingRef,
    updateParticles,
    detectSimulationAnomalies,
    handleCanvasReady
  } = useParticleManagement({
    intentFluctuationRate,
    maxParticles,
    learningRate,
    particleCreationRate,
    viewMode,
    running,
    renderMode,
    useAdaptiveParticles,
    energyConservation,
    probabilisticIntent,
    onAnomalyDetected,
    onInflationDetected: handleInflationDetected,
    onStatsUpdate
  });

  // Setup data collection
  const {
    dataCollectionActiveRef,
    dataExportOptions,
    processSimulationData,
    handleExportData,
    toggleDataCollection
  } = useSimulationData(onStatsUpdate);

  // Setup rendering
  const { renderSimulation } = useCanvasRenderer();

  // Setup animation loop
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
    
    // Reset stats
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
  }, [
    toast, 
    particlesRef, 
    interactionsRef, 
    frameCountRef, 
    simulationTimeRef, 
    intentFieldRef, 
    processSimulationData, 
    onStatsUpdate
  ]);

  return (
    <div className="relative w-full h-full">
      <ParticleDisplay
        canvasRef={canvasRef}
        particleCount={particleCount}
        showInflationBanner={showInflationBanner}
        latestInflation={latestInflation}
        onCanvasReady={handleCanvasReady}
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
