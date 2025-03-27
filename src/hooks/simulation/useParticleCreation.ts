
import { useCallback } from 'react';
import { createParticleFromField } from '@/utils/particleUtils';
import { SimulationConfig } from './types';

export function useParticleCreation(
  config: SimulationConfig,
  running: boolean,
  isInitialized: boolean,
  particlesRef: React.MutableRefObject<any[]>,
  intentFieldRef: React.MutableRefObject<number[][][]>,
  dimensionsRef: React.MutableRefObject<{ width: number; height: number }>
) {
  // Get post-inflation particle color
  const getPostInflationColor = (charge: 'positive' | 'negative' | 'neutral'): string => {
    switch (charge) {
      case 'positive':
        return 'rgba(209, 70, 239, 0.95)'; // Bright magenta
      case 'negative':
        return 'rgba(139, 92, 246, 0.95)'; // Bright purple
      case 'neutral':
        return 'rgba(14, 165, 233, 0.95)'; // Bright blue
      default:
        return 'rgba(209, 70, 239, 0.95)';
    }
  };

  // Create new particles
  const createNewParticles = useCallback((count = 3, postInflation = false) => {
    if (!running || !isInitialized || 
       (!postInflation && particlesRef.current.length >= config.maxParticles)) {
      return;
    }

    const { width, height } = dimensionsRef.current;
    
    // Maximum number of particles to add per call
    const maxNewParticles = postInflation 
      ? count 
      : Math.min(count, config.maxParticles - particlesRef.current.length);
    
    // Random number of new particles, at least 1
    const numNewParticles = postInflation 
      ? maxNewParticles 
      : Math.max(1, Math.floor(Math.random() * maxNewParticles));
    
    for (let i = 0; i < numNewParticles; i++) {
      // Random position
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random() * 10; // For 3D simulations
      
      // Get field value at position
      const fieldX = Math.floor(x / (width / intentFieldRef.current[0][0].length));
      const fieldY = Math.floor(y / (height / intentFieldRef.current[0].length));
      const fieldZ = Math.floor(z / (10 / intentFieldRef.current.length));
      
      // Get the intent field value at this location (with boundary checks)
      const fieldValue = intentFieldRef.current[
        Math.min(fieldZ, intentFieldRef.current.length - 1)
      ][
        Math.min(fieldY, intentFieldRef.current[0].length - 1)
      ][
        Math.min(fieldX, intentFieldRef.current[0][0].length - 1)
      ];
      
      // Create particle based on field value
      const newParticle = createParticleFromField(fieldValue, x, y, z, Date.now() + i);

      // Mark as post-inflation particle
      if (postInflation) {
        newParticle.isPostInflation = true;
        newParticle.color = getPostInflationColor(newParticle.charge);
        newParticle.scale = 1.2; // Slightly larger
      }

      // Maybe make it adaptive
      if (config.useAdaptiveParticles && Math.random() < 0.1) {
        newParticle.type = 'adaptive';
        newParticle.color = postInflation 
          ? 'rgba(236, 72, 253, 0.9)' // Brighter pink for post-inflation adaptive particles
          : 'rgba(236, 72, 153, 0.85)'; // Regular pink for adaptive particles
        newParticle.adaptiveScore = 1;
      }
      
      // Configure energy properties
      if (config.energyConservation) {
        newParticle.energyCapacity = 1 + Math.random() * 0.5;
        newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
      } else {
        newParticle.energyCapacity = 100;
        newParticle.intentDecayRate = 0.00001;
      }
      
      particlesRef.current.push(newParticle);
    }
  }, [config, running, isInitialized, particlesRef, dimensionsRef, intentFieldRef]);

  return { createNewParticles };
}
