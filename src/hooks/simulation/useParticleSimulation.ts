
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
  onInflationDetected?: (event: InflationEvent) => void,
  onDiscordEvent?: (eventType: string, data: any) => void
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
  const { particles, setParticles, createNewParticles } = useParticleCreation({
    maxParticles: config.maxParticles,
    particleCreationRate: config.particleCreationRate,
    intentFluctuationRate: config.intentFluctuationRate,
    probabilisticIntent: config.probabilisticIntent || false,
    running
  });

  // Update particlesRef with the latest particles
  useEffect(() => {
    particlesRef.current = particles;
    
    // If Discord integration is enabled, send event when particles change significantly
    if (onDiscordEvent && particles.length % 5 === 0 && particles.length > 0) {
      onDiscordEvent('particle_update', {
        count: particles.length,
        positiveCharge: particles.filter(p => p.charge === 'positive').length,
        negativeCharge: particles.filter(p => p.charge === 'negative').length,
        neutralCharge: particles.filter(p => p.charge === 'neutral').length,
        averageIntent: particles.reduce((sum, p) => sum + p.intent, 0) / particles.length
      });
    }
  }, [particles, particlesRef, onDiscordEvent]);

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
      // This function creates new particles after inflation
      const newParticlesCount = Math.floor(Math.random() * 10) + 5;
      for (let i = 0; i < newParticlesCount; i++) {
        if (particlesRef.current.length < config.maxParticles) {
          createNewParticles();
        }
      }
    },
    (event) => {
      // Call the original callback
      if (onInflationDetected) {
        onInflationDetected(event);
      }
      
      // Send to Discord if integration is enabled
      if (onDiscordEvent) {
        onDiscordEvent('inflation_event', {
          timestamp: event.timestamp,
          particlesBeforeInflation: event.particlesBeforeInflation,
          particlesAfterInflation: event.particlesAfterInflation,
          intentInformation: event.intentInformation
        });
      }
    }
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
    (anomaly) => {
      // Call the original callback
      if (onAnomalyDetected) {
        onAnomalyDetected(anomaly);
      }
      
      // Send to Discord if integration is enabled
      if (onDiscordEvent) {
        onDiscordEvent('anomaly_detected', {
          type: anomaly.type,
          timestamp: anomaly.timestamp,
          description: anomaly.description,
          particlesInvolved: anomaly.particlesInvolved,
          severity: anomaly.severity
        });
      }
    }
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
    createNewParticles,
    detectSimulationAnomalies
  };
}
