
import { useCallback, useEffect } from 'react';
import { AnomalyEvent } from '@/utils/particleUtils';
import { SimulationConfig, InflationEvent } from './types';
import { useSimulationState } from './useSimulationState';
import { useSimulationInitialization } from './useSimulationInitialization';
import { useParticleCreation } from './useParticleCreation';
import { useAnomalyDetection } from './useAnomalyDetection';
import { useInflationHandler } from './useInflationHandler';
import { useParticleUpdater } from './useParticleUpdater';

export function useParticleSimulation(
  config: SimulationConfig,
  running: boolean,
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void,
  onInflationDetected?: (event: InflationEvent) => void
) {
  // Initialize state refs
  const {
    isInitialized,
    setIsInitialized,
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    originalDimensionsRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    isAnimatingRef,
    isInflatedRef,
    inflationTimeRef
  } = useSimulationState();

  // Initialize simulation
  const { initializeSimulation } = useSimulationInitialization(
    setIsInitialized,
    intentFieldRef,
    dimensionsRef,
    originalDimensionsRef
  );

  // Create particles
  const { particles, setParticles } = useParticleCreation({
    maxParticles: config.maxParticles,
    particleCreationRate: config.particleCreationRate,
    intentFluctuationRate: config.intentFluctuationRate,
    probabilisticIntent: config.probabilisticIntent || false,
    running
  });

  // Update particlesRef with the latest particles
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles, particlesRef]);

  // Handle inflation
  const { checkInflationConditions, resetInflation } = useInflationHandler(
    config,
    running,
    isInitialized,
    isInflatedRef,
    inflationTimeRef,
    particlesRef,
    interactionsRef,
    dimensionsRef,
    originalDimensionsRef,
    () => {
      // This function replaces createNewParticles
      const newParticlesCount = Math.floor(Math.random() * 10) + 5;
      for (let i = 0; i < newParticlesCount; i++) {
        if (particlesRef.current.length < config.maxParticles) {
          // Let the useParticleCreation hook handle particle creation
        }
      }
    },
    onInflationDetected
  );

  // Update particles
  const { updateParticles } = useParticleUpdater(
    config,
    running,
    isInitialized,
    particlesRef,
    intentFieldRef,
    dimensionsRef,
    frameCountRef,
    simulationTimeRef,
    checkInflationConditions
  );

  // Detect anomalies
  const { detectSimulationAnomalies } = useAnomalyDetection(
    running,
    isInitialized,
    particlesRef,
    frameCountRef,
    onAnomalyDetected
  );

  // Gradually return to original dimensions if inflated (after 5 seconds)
  useEffect(() => {
    if (!running) return;
    
    const checkInflationReset = () => {
      if (isInflatedRef.current && inflationTimeRef.current && 
          (Date.now() - inflationTimeRef.current > 5000)) {
        resetInflation();
      }
    };
    
    const interval = setInterval(checkInflationReset, 500);
    return () => clearInterval(interval);
  }, [running, isInflatedRef, inflationTimeRef, resetInflation]);

  return {
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
    detectSimulationAnomalies
  };
}
