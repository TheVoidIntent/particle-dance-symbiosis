
import React from 'react';
import { useParticleSimulation } from '@/hooks/simulation';
import { useSimulationData } from '@/hooks/useSimulationData';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';
import { AnomalyEvent } from '@/utils/particleUtils';
import { ParticleDisplay } from '@/components/simulation/ParticleDisplay';
import { useInflationEvents } from '@/hooks/useInflationEvents';
import { useParticleManagement } from '@/hooks/useParticleManagement';
import { ParticleControls } from '@/components/simulation/ParticleControls';
import { useAudioEvents } from '@/hooks/useAudioEvents';
import { useSimulationReset } from '@/hooks/useSimulationReset';

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
  // Custom hooks for event handling
  const { showInflationBanner, latestInflation, handleInflationDetected } = useInflationEvents();
  const { handleAnomalyWithAudio, handleInflationWithAudio } = useAudioEvents(
    onAnomalyDetected, 
    handleInflationDetected
  );
  
  // Particle management
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

  // Data collection and export
  const {
    dataCollectionActiveRef,
    dataExportOptions,
    processSimulationData,
    handleExportData,
    toggleDataCollection
  } = useSimulationData(onStatsUpdate);

  // Canvas rendering
  const { renderSimulation } = useCanvasRenderer();

  // Simulation reset
  const { resetSimulation } = useSimulationReset({
    particlesRef,
    intentFieldRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    canvasRef,
    processSimulationData,
    onStatsUpdate
  });

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

  // Process current stats for display
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
      
      <ParticleControls 
        particles={particlesRef.current || []} 
        stats={currentStats}
        isRunning={running}
        dataCollectionActive={dataCollectionActiveRef.current}
        onExportData={handleExportData}
        onToggleDataCollection={toggleDataCollection}
        onResetSimulation={resetSimulation}
      />
    </div>
  );
};
