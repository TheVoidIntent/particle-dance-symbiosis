
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Particle } from '@/types/simulation';
import { InflationEvent } from './types';

interface UseInflationHandlerProps {
  config: {
    inflationEnabled: boolean;
    inflationThreshold: number;
    inflationMultiplier: number;
  };
  onInflationEvent?: (event: InflationEvent) => void;
}

export { InflationEvent };

/**
 * Hook for handling inflation events in the simulation
 */
export function useInflationHandler({
  config,
  onInflationEvent
}: UseInflationHandlerProps) {
  /**
   * Check if conditions meet for an inflation event
   */
  const checkForInflation = useCallback((particles: Particle[]): boolean => {
    if (!config.inflationEnabled) return false;
    
    // Check if particle count has reached threshold
    return particles.length >= config.inflationThreshold;
  }, [config.inflationEnabled, config.inflationThreshold]);

  /**
   * Handle an inflation event when it occurs
   */
  const handleInflation = useCallback((particles: Particle[]): Particle[] => {
    // Store original particle count
    const particlesBefore = particles.length;
    
    // Apply inflation effects
    // 1. Expand the universe (not changing existing positions)
    // 2. Add energy to existing particles
    const inflatedParticles = particles.map(particle => ({
      ...particle,
      energy: (particle.energy || 1) * config.inflationMultiplier,
      complexity: (particle.complexity || 1) * 1.2,
      isPostInflation: true
    }));
    
    // Create additional particles depending on multiplier
    const newParticles: Particle[] = [];
    const particlesToAdd = Math.floor(particlesBefore * (config.inflationMultiplier - 1));
    
    if (particlesToAdd > 0) {
      // Generate new particles
      for (let i = 0; i < particlesToAdd; i++) {
        // Base the new particle on a random existing one
        const template = inflatedParticles[Math.floor(Math.random() * inflatedParticles.length)];
        
        // Create a new particle with some randomization
        newParticles.push({
          ...template,
          id: uuidv4(),
          x: Math.random() * 800, // Replace with dimension reference
          y: Math.random() * 600, // Replace with dimension reference
          z: Math.random() * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 0.5,
          energy: template.energy * (0.8 + Math.random() * 0.4),
          knowledge: template.knowledge * (0.5 + Math.random() * 1),
          complexity: template.complexity * (0.7 + Math.random() * 0.6),
          interactionCount: 0,
          interactions: 0,
          lastInteraction: 0,
          created: Date.now(),
          creationTime: Date.now(),
          age: 0
        });
      }
    }
    
    // Combine original and new particles
    const result = [...inflatedParticles, ...newParticles];
    const particlesAfter = result.length;
    
    // Notify about the inflation event
    if (onInflationEvent) {
      onInflationEvent({
        id: uuidv4(),
        timestamp: Date.now(),
        particlesBefore,
        particlesAfter,
        inflationFactor: config.inflationMultiplier,
        energyIncrease: config.inflationMultiplier - 1,
        complexityIncrease: 0.2,
        narrative: `Universe inflation event: Particle count increased from ${particlesBefore} to ${particlesAfter}, energy multiplied by ${config.inflationMultiplier.toFixed(2)}.`
      });
    }
    
    return result;
  }, [config.inflationMultiplier, onInflationEvent]);

  return {
    checkForInflation,
    handleInflation
  };
}
