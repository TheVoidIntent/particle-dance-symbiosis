
import { useState, useEffect, useCallback, useRef } from 'react';
import { Particle } from '@/utils/particleUtils';
import { useParticleSimulation, InflationEvent } from '@/hooks/simulation';

type ParticleManagementProps = {
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
  onAnomalyDetected?: (anomaly: any) => void;
  onInflationDetected: (event: InflationEvent) => void;
  onStatsUpdate: (stats: any) => void;
};

export function useParticleManagement({
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
  onAnomalyDetected,
  onInflationDetected,
  onStatsUpdate
}: ParticleManagementProps) {
  const [particleCount, setParticleCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    onInflationDetected
  );

  // Update particle count for UI display
  useEffect(() => {
    if (particlesRef.current) {
      setParticleCount(particlesRef.current.length);
      
      // Make sure we're updating stats even if no simulation step has happened yet
      if (particlesRef.current.length > 0) {
        // Force stats update at least once per second
        onStatsUpdate({
          particleCount: particlesRef.current.length,
          intentField: intentFieldRef.current || [],
          interactions: interactionsRef.current || 0,
          frame: frameCountRef.current || 0,
          time: simulationTimeRef.current || 0
        });
      }
    }
  }, [
    particlesRef.current?.length, 
    intentFieldRef, 
    interactionsRef, 
    frameCountRef, 
    simulationTimeRef, 
    onStatsUpdate
  ]);

  // Regular stats update on interval
  useEffect(() => {
    if (!isInitialized || !running) return;
    
    const statsUpdateInterval = setInterval(() => {
      if (particlesRef.current && particlesRef.current.length > 0) {
        onStatsUpdate({
          particleCount: particlesRef.current.length,
          intentField: intentFieldRef.current || [],
          interactions: interactionsRef.current || 0,
          frame: frameCountRef.current || 0,
          time: simulationTimeRef.current || 0
        });
      }
    }, 500); // Update every 500ms
    
    return () => clearInterval(statsUpdateInterval);
  }, [
    isInitialized, 
    running, 
    particlesRef, 
    intentFieldRef, 
    interactionsRef, 
    frameCountRef, 
    simulationTimeRef, 
    onStatsUpdate
  ]);

  // Initialize canvas and start simulation
  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    initializeSimulation(canvas);
  }, [initializeSimulation]);

  // Manage particle creation based on simulation parameters
  useEffect(() => {
    if (!running || !isInitialized || !intentFieldRef.current || intentFieldRef.current.length === 0) return;
    
    const createParticlesInterval = setInterval(() => {
      createNewParticles();
    }, 1000 / particleCreationRate);
    
    return () => clearInterval(createParticlesInterval);
  }, [running, isInitialized, createNewParticles, particleCreationRate, intentFieldRef]);

  return {
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
  };
}
