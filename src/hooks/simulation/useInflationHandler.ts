
import { useCallback } from 'react';
import { Particle } from '@/types/simulation';
import { createParticle } from '@/utils/particleUtils';
import { v4 as uuidv4 } from 'uuid';

export interface InflationEvent {
  id: string;
  timestamp: number;
  particlesBefore: number;
  particlesAfter: number;
  inflationFactor: number;
  energyIncrease: number;
  complexityIncrease: number;
  narrative: string;
}

interface UseInflationHandlerProps {
  config: {
    inflationEnabled?: boolean;
    inflationThreshold?: number;
    inflationMultiplier?: number;
  };
  onInflationEvent?: (event: InflationEvent) => void;
}

export function useInflationHandler({
  config,
  onInflationEvent
}: UseInflationHandlerProps) {
  const checkForInflation = useCallback((particles: Particle[]): boolean => {
    if (!config.inflationEnabled) return false;
    
    return particles.length >= (config.inflationThreshold || 100);
  }, [config.inflationEnabled, config.inflationThreshold]);
  
  const handleInflation = useCallback((particles: Particle[]): Particle[] => {
    // Don't do anything if inflation is disabled
    if (!config.inflationEnabled) return particles;
    
    const particleCountBefore = particles.length;
    
    // Calculate the number of new particles to create
    const inflationMultiplier = config.inflationMultiplier || 1.5;
    const newParticleCount = Math.floor(particles.length * (inflationMultiplier - 1));
    
    // Create new particles with properties based on existing ones
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < newParticleCount; i++) {
      // Get a random existing particle to base the new one on
      const baseParticle = particles[Math.floor(Math.random() * particles.length)];
      
      // Calculate position near the base particle
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const x = baseParticle.x + Math.cos(angle) * distance;
      const y = baseParticle.y + Math.sin(angle) * distance;
      
      // Create new particle
      const newParticle = createParticle(
        x,
        y,
        0,
        baseParticle.charge,
        baseParticle.type || 'standard',
        Date.now()
      );
      
      // Mark as post-inflation particle
      newParticle.isPostInflation = true;
      
      newParticles.push(newParticle);
    }
    
    // Calculate energy and complexity increase
    const energyBefore = particles.reduce((sum, p) => sum + (p.energy || 0), 0);
    const complexityBefore = particles.reduce((sum, p) => sum + (p.complexity || 0), 0);
    
    const energyAfter = energyBefore + newParticles.reduce((sum, p) => sum + (p.energy || 0), 0);
    const complexityAfter = complexityBefore + newParticles.reduce((sum, p) => sum + (p.complexity || 0), 0);
    
    const inflationEvent: InflationEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      particlesBefore: particleCountBefore,
      particlesAfter: particleCountBefore + newParticles.length,
      inflationFactor: inflationMultiplier,
      energyIncrease: energyAfter - energyBefore,
      complexityIncrease: complexityAfter - complexityBefore,
      narrative: `Universe inflation event created ${newParticles.length} new particles`
    };
    
    // Notify about the inflation event
    if (onInflationEvent) {
      onInflationEvent(inflationEvent);
    }
    
    return [...particles, ...newParticles];
  }, [config.inflationEnabled, config.inflationMultiplier, onInflationEvent]);
  
  return {
    checkForInflation,
    handleInflation
  };
}
