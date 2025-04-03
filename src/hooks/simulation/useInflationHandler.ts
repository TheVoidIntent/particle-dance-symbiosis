import { useCallback, useRef } from 'react';
import { SimulationConfig, InflationEvent } from '@/hooks/simulation/types';
import { Particle } from '@/utils/particleUtils';

export interface UseInflationHandlerProps {
  config: SimulationConfig;
  onInflationEvent?: (event: InflationEvent) => void;
}

/**
 * Hook for handling the "inflation" event in the simulation
 */
export function useInflationHandler({
  config,
  onInflationEvent
}: UseInflationHandlerProps) {
  // Keep track of if inflation has already occurred
  const hasInflatedRef = useRef<boolean>(false);
  
  /**
   * Check if inflation should occur based on particle count
   */
  const checkForInflation = useCallback((particles: Particle[]): boolean => {
    if (!config.inflationEnabled || hasInflatedRef.current) {
      return false;
    }
    
    // Trigger inflation if particle count exceeds threshold
    return particles.length >= config.inflationThreshold;
  }, [config.inflationEnabled, config.inflationThreshold]);
  
  /**
   * Generate a new set of post-inflation particles
   */
  const createPostInflationParticles = useCallback((particles: Particle[]): Particle[] => {
    // Create new particles with "post-inflation" flag set to true
    return particles.map(particle => ({
      ...particle,
      isPostInflation: true
    }));
  }, []);
  
  /**
   * Handle the inflation event
   */
  const handleInflation = useCallback((particles: Particle[]): Particle[] => {
    if (hasInflatedRef.current) {
      return particles;
    }
    
    const timestamp = Date.now();
    const particleCountBefore = particles.length;
    
    // Create post-inflation particle set
    const newParticles = createPostInflationParticles(particles);
    
    // Mark inflation as occurred
    hasInflatedRef.current = true;
    
    // Create inflation event object
    const event: InflationEvent = {
      timestamp,
      particlesBeforeInflation: particleCountBefore,
      particlesAfterInflation: newParticles.length,
      expansionFactor: config.inflationMultiplier,
      particleCountBefore,
      fieldEnergyBefore: Math.random() * 100,
      fieldEnergyAfter: Math.random() * 200
    };
    
    // Notify about the inflation event
    if (onInflationEvent) {
      onInflationEvent(event);
    }
    
    console.log(`🌌 Inflation event at ${new Date(timestamp).toLocaleTimeString()}`);
    console.log(`📊 Particles: ${particleCountBefore} → ${newParticles.length}`);
    
    return newParticles;
  }, [config.inflationMultiplier, createPostInflationParticles, onInflationEvent]);
  
  /**
   * Reset inflation state
   */
  const resetInflation = useCallback((): void => {
    hasInflatedRef.current = false;
  }, []);
  
  return {
    checkForInflation,
    handleInflation,
    resetInflation,
    hasInflated: hasInflatedRef.current
  };
}
