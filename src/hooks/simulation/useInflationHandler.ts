
import { useCallback } from 'react';
import { Particle, createParticle } from '@/utils/particleUtils';
import { SimulationConfig, InflationEvent } from './types';

interface UseInflationHandlerProps {
  config: SimulationConfig;
  onInflationEvent?: (event: InflationEvent) => void;
}

export function useInflationHandler({
  config,
  onInflationEvent
}: UseInflationHandlerProps) {
  const checkForInflation = useCallback((particles: Particle[]): boolean => {
    if (!config.inflationEnabled) return false;
    
    // Check if we've reached the inflation threshold
    if (particles.length >= config.inflationThreshold) {
      // Check if we haven't already inflated (would be indicated by isPostInflation flag)
      const alreadyInflated = particles.some(p => p.isPostInflation);
      return !alreadyInflated;
    }
    
    return false;
  }, [config.inflationEnabled, config.inflationThreshold]);
  
  const handleInflation = useCallback((particles: Particle[]): Particle[] => {
    // Create an inflation event object
    const event: InflationEvent = {
      timestamp: Date.now(),
      particleCountBefore: particles.length,
      expansionFactor: config.inflationMultiplier
    };
    
    // Create new post-inflation particles
    const newParticles: Particle[] = [];
    const newParticleCount = Math.floor(particles.length * (config.inflationMultiplier - 1));
    
    for (let i = 0; i < newParticleCount; i++) {
      // Randomly choose positions for new particles
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const z = Math.random() * 10;
      
      // Bias towards having more positive charge particles post-inflation
      const chargeRoll = Math.random();
      let charge: 'positive' | 'negative' | 'neutral';
      
      if (chargeRoll > 0.6) {
        charge = 'positive';
      } else if (chargeRoll > 0.3) {
        charge = 'neutral';
      } else {
        charge = 'negative';
      }
      
      // Create a new particle with the isPostInflation flag
      const newParticle = createParticle(
        x, 
        y, 
        z, 
        charge,
        Math.random() < 0.2 ? 'high-energy' : 'regular',
        Date.now()
      );
      
      // Mark as post-inflation
      newParticle.isPostInflation = true;
      
      // Add to new particles list
      newParticles.push(newParticle);
    }
    
    // Mark all existing particles as post-inflation too
    const updatedExistingParticles = particles.map(p => ({
      ...p,
      isPostInflation: true
    }));
    
    // Update the event with final counts
    event.particleCountAfter = updatedExistingParticles.length + newParticles.length;
    
    // Call the event handler if provided
    if (onInflationEvent) {
      onInflationEvent(event);
    }
    
    // Return combined list of particles
    return [...updatedExistingParticles, ...newParticles];
  }, [config.inflationMultiplier, onInflationEvent]);
  
  return {
    checkForInflation,
    handleInflation
  };
}

export default useInflationHandler;
