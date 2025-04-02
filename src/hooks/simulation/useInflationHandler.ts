
import { useCallback } from 'react';
import { createParticle } from '@/utils/particleUtils';
import { Particle, InflationEvent, SimulationConfig } from '@/types/simulation';

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
      // Create new particles using our utility function
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      const newParticle = createParticle(x, y, {
        energy: Math.random() * 100,
        intent: Math.random(),
        charge: Math.random() > 0.5 ? 'positive' : (Math.random() > 0.5 ? 'negative' : 'neutral')
      });
      
      // Mark as post-inflation
      newParticle.isPostInflation = true;
      
      additionalParticles.push(newParticle);
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
