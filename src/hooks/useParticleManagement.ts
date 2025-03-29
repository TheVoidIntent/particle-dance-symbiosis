
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

  // Update particle count for UI display - fixed to avoid infinite updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (particlesRef.current) {
        setParticleCount(particlesRef.current.length);
        
        // Make sure we're updating stats even if no simulation step has happened yet
        if (particlesRef.current.length > 0) {
          onStatsUpdate({
            particleCount: particlesRef.current.length,
            positiveParticles: particlesRef.current.filter(p => p.charge === 'positive').length,
            negativeParticles: particlesRef.current.filter(p => p.charge === 'negative').length,
            neutralParticles: particlesRef.current.filter(p => p.charge === 'neutral').length,
            highEnergyParticles: particlesRef.current.filter(p => p.type === 'high-energy').length,
            quantumParticles: particlesRef.current.filter(p => p.type === 'quantum').length,
            compositeParticles: particlesRef.current.filter(p => p.type === 'composite').length,
            adaptiveParticles: particlesRef.current.filter(p => p.type === 'adaptive').length,
            intentField: intentFieldRef.current || [],
            interactions: interactionsRef.current || 0,
            totalInteractions: interactionsRef.current || 0,
            frame: frameCountRef.current || 0,
            time: simulationTimeRef.current || 0,
            averageKnowledge: particlesRef.current.length > 0 
              ? particlesRef.current.reduce((sum, p) => sum + (p.knowledge || 0), 0) / particlesRef.current.length 
              : 0,
            complexityIndex: particlesRef.current.length > 0
              ? particlesRef.current.reduce((sum, p) => sum + (p.complexity || 1), 0) / particlesRef.current.length
              : 0,
            systemEntropy: 0.1 + Math.random() * 0.4 // Simple placeholder until real calculation is implemented
          });
        }
      }
    }, 500); // Update every 500ms
    
    return () => clearInterval(updateInterval);
  }, [onStatsUpdate, particlesRef, intentFieldRef, interactionsRef, frameCountRef, simulationTimeRef]);

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
