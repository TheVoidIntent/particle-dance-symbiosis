
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
import SimulationAudioControls from '@/components/simulation/SimulationAudioControls';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

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
  
  const { 
    showInflationBanner, 
    latestInflation, 
    handleInflationDetected 
  } = useInflationEvents();

  const handleAnomalyWithAudio = useCallback((anomaly: AnomalyEvent) => {
    if (onAnomalyDetected) {
      onAnomalyDetected(anomaly);
    }
    
    playSimulationEvent('anomaly_detected', {
      severity: anomaly.severity || 0.5,
      type: anomaly.type
    });
  }, [onAnomalyDetected]);
  
  const handleInflationWithAudio = useCallback((event: InflationEvent) => {
    handleInflationDetected(event);
    
    playSimulationEvent('inflation_event', {
      timestamp: event.timestamp,
      particlesBeforeInflation: event.particlesBeforeInflation,
      particlesAfterInflation: event.particlesAfterInflation
    });
  }, [handleInflationDetected]);

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
    onAnomalyDetected: handleAnomalyWithAudio,
    onInflationDetected: handleInflationWithAudio,
    onStatsUpdate
  });

  const {
    dataCollectionActiveRef,
    dataExportOptions,
    processSimulationData,
    handleExportData,
    toggleDataCollection
  } = useSimulationData(onStatsUpdate);

  const { renderSimulation } = useCanvasRenderer();

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
    
    // Fix: Return an empty array to match the expected return type
    return [];
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

  const currentStats = processSimulationData(
    particlesRef.current || [],
    intentFieldRef.current || [],
    interactionsRef.current || 0,
    frameCountRef.current || 0,
    simulationTimeRef.current || 0
  );

  return (
    <div className="relative w-full h-full">
      <ParticleDisplay
        canvasRef={canvasRef}
        particleCount={particleCount}
        showInflationBanner={showInflationBanner}
        latestInflation={latestInflation}
        onCanvasReady={handleCanvasReady}
      />
      
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg w-80 z-10">
        <SimulationAudioControls 
          particles={particlesRef.current || []} 
          stats={currentStats}
          isRunning={running}
        />
      </div>
      
      <SimulationControlButtons 
        dataCollectionActive={dataCollectionActiveRef.current}
        onExportData={handleExportData}
        onToggleDataCollection={toggleDataCollection}
        onResetSimulation={resetSimulation}
      />
    </div>
  );
};
