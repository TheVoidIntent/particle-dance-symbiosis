
import { useCallback } from 'react';
import { Particle } from '@/utils/particleUtils';
import { InflationEvent, SimulationConfig } from './types';

interface UseInflationHandlerProps {
  config: SimulationConfig;
  onInflationEvent?: (event: InflationEvent) => void;
}

export function useInflationHandler({ config, onInflationEvent }: UseInflationHandlerProps) {
  const checkForInflation = useCallback((particles: Particle[]): boolean => {
    if (!config.inflationEnabled) return false;
    
    // Check if the number of particles has reached the inflation threshold
    return particles.length >= config.inflationThreshold;
  }, [config.inflationEnabled, config.inflationThreshold]);
  
  const handleInflation = useCallback((particles: Particle[]): Particle[] => {
    if (!config.inflationEnabled) return particles;
    
    const particlesBeforeInflation = particles.length;
    
    // Create a new array with the expanded/transformed particles
    const inflatedParticles = particles.map(particle => {
      // Clone the particle to avoid mutations
      const newParticle = { ...particle };
      
      // Apply inflation effects
      // Typically this might increase energy, reduce density, etc.
      newParticle.energy = (newParticle.energy || 0) * 1.5;
      newParticle.isPostInflation = true;
      
      return newParticle;
    });
    
    // You might also add additional particles during inflation
    const additionalParticles: Particle[] = [];
    const additionalCount = Math.floor(particles.length * (config.inflationMultiplier - 1));
    
    for (let i = 0; i < additionalCount; i++) {
      // Create new particles (simplified - in a real implementation you would create valid particles)
      additionalParticles.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        charge: Math.random() > 0.5 ? 'positive' : (Math.random() > 0.5 ? 'negative' : 'neutral'),
        energy: Math.random() * 100,
        intent: Math.random(),
        isPostInflation: true,
      });
    }
    
    // Combine original (inflated) and new particles
    const resultParticles = [...inflatedParticles, ...additionalParticles];
    
    // Trigger the inflation event callback
    if (onInflationEvent) {
      const event: InflationEvent = {
        timestamp: Date.now(),
        particlesBeforeInflation,
        particlesAfterInflation: resultParticles.length,
        expansionFactor: config.inflationMultiplier
      };
      onInflationEvent(event);
    }
    
    return resultParticles;
  }, [config.inflationEnabled, config.inflationMultiplier, onInflationEvent]);
  
  return {
    checkForInflation,
    handleInflation
  };
}

export default useInflationHandler;
