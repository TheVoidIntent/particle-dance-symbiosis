import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useParticleSimulation, InflationEvent } from '@/hooks/simulation';
import { useSimulationData } from '@/hooks/useSimulationData';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';
import { SimulationControlButtons } from '@/components/SimulationControlButtons';
import { AnomalyEvent } from '@/utils/particleUtils';
import { clearPersistedState, clearSimulationData } from '@/utils/dataExportUtils';
import { useToast } from "@/hooks/use-toast";
import { Particle } from '@/hooks/simulation/types';

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
  const [showInflationBanner, setShowInflationBanner] = useState(false);
  const [latestInflation, setLatestInflation] = useState<InflationEvent | null>(null);
  const [particleCount, setParticleCount] = useState(0);

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
    isInflatedRef,
    inflationTimeRef,
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
      renderMode,
      useAdaptiveParticles,
      energyConservation,
      probabilisticIntent
    },
    running,
    onAnomalyDetected,
    handleInflationDetected
  );

  const {
    dataCollectionActiveRef,
    dataExportOptions,
    processSimulationData,
    handleExportData,
    toggleDataCollection
  } = useSimulationData(onStatsUpdate);

  const { renderSimulation } = useCanvasRenderer();

  // Update particle count for UI display
  useEffect(() => {
    if (particlesRef.current) {
      setParticleCount(particlesRef.current.length);
      
      // Make sure we're updating stats even if no simulation step has happened yet
      if (particlesRef.current.length > 0 && !frameCountRef.current) {
        processSimulationData(
          particlesRef.current,
          intentFieldRef.current || [],
          interactionsRef.current || 0,
          frameCountRef.current || 0,
          simulationTimeRef.current || 0
        );
      }
    }
  }, [particlesRef.current?.length, processSimulationData, intentFieldRef, interactionsRef, frameCountRef, simulationTimeRef]);

  // Handle inflation events
  function handleInflationDetected(event: InflationEvent) {
    setLatestInflation(event);
    setShowInflationBanner(true);
    
    // Show toast notification
    toast({
      title: "Universe Inflation Detected!",
      description: `The simulation space has expanded with ${event.particlesAfterInflation - event.particlesBeforeInflation} new particles`,
      variant: "default",
    });
    
    // Hide banner after 5 seconds
    setTimeout(() => {
      setShowInflationBanner(false);
    }, 5000);
  }

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
    handleResize(); // Call once to initialize
    
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeSimulation, dimensionsRef]);

  // Manage particle creation based on simulation parameters
  useEffect(() => {
    if (!running || !isInitialized || !intentFieldRef.current || intentFieldRef.current.length === 0) return;
    
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
      
      {/* Particle Count Display */}
      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        Particles: {particleCount}
      </div>
      
      {/* Inflation Banner */}
      {showInflationBanner && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 text-center animate-pulse z-10">
          🌌 Universe Inflation Event Detected! 🌌
        </div>
      )}
      
      <SimulationControlButtons 
        dataCollectionActive={dataCollectionActiveRef.current}
        onExportData={handleExportData}
        onToggleDataCollection={toggleDataCollection}
        onResetSimulation={resetSimulation}
      />
    </div>
  );
};
