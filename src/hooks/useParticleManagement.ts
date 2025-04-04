
import { useState, useEffect, useCallback, useRef } from 'react';
import { Particle } from '@/types/simulation';
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
  
  const simulation = useParticleSimulation({
    initialParticleCount: 10,
    config: {
      maxParticles,
      intentFluctuationRate,
      interactionRadius: 30,
      boundaryCondition: 'wrap',
      inflationEnabled: true
    },
    canvasRef
  });

  // Destructure all required properties from simulation
  const {
    particles,
    intentField,
    isRunning,
    simulationTime,
    interactionsCount,
    frameCount,
    startSimulation,
    stopSimulation,
    resetSimulation,
    addParticles,
    createParticle,
    emergenceIndex,
    intentFieldComplexity,
    particlesRef,
    intentFieldRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    dimensionsRef,
    isInitialized,
    isAnimatingRef,
    initializeSimulation,
    updateParticles,
    createNewParticles,
    detectSimulationAnomalies
  } = simulation;

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (particlesRef.current) {
        setParticleCount(particlesRef.current.length);
        
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
            systemEntropy: 0.1 + Math.random() * 0.4
          });
        }
      }
    }, 500);
    
    return () => clearInterval(updateInterval);
  }, [onStatsUpdate, particlesRef, intentFieldRef, interactionsRef, frameCountRef, simulationTimeRef]);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    initializeSimulation(canvas);
  }, [initializeSimulation]);

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
