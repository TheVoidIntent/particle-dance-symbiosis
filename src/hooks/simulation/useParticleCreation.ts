import { useCallback } from 'react';
import { SimulationConfig, SimulationState, Particle } from './types';
import { createParticleFromField } from '@/utils/particleUtils';

export function useParticleCreation(
  config: SimulationConfig,
  running: boolean,
  isInitialized: boolean,
  particlesRef: React.MutableRefObject<Particle[]>,
  intentFieldRef: React.MutableRefObject<number[][][]>,
  dimensionsRef: React.MutableRefObject<SimulationState['dimensions']>
) {
  const createNewParticles = useCallback(() => {
    if (!running || !isInitialized || particlesRef.current.length >= config.maxParticles) {
      return;
    }

    const { width, height } = dimensionsRef.current;
    const intentField = intentFieldRef.current;
    
    if (!intentField.length || !intentField[0].length || !intentField[0][0].length) {
      return;
    }
    
    // Create 1-3 particles
    const numToCreate = Math.min(
      Math.floor(Math.random() * 3) + 1,
      config.maxParticles - particlesRef.current.length
    );
    
    for (let i = 0; i < numToCreate; i++) {
      // Find a random location with reasonable intent fluctuation
      let attempts = 0;
      let foundLocation = false;
      let x = 0, y = 0, z = 0, fieldValue = 0;
      
      // Try to find a location with significant intent fluctuation
      while (!foundLocation && attempts < 10) {
        x = Math.random() * width;
        y = Math.random() * height;
        z = Math.random() * 9.9; // z-dimension for 3D
        
        // Get the intent field value at this location
        const fieldX = Math.floor(x / (width / intentField[0][0].length));
        const fieldY = Math.floor(y / (height / intentField[0].length));
        const fieldZ = Math.floor(z / (10 / intentField.length));
        
        if (fieldZ < intentField.length && 
            fieldY < intentField[0].length && 
            fieldX < intentField[0][0].length) {
          fieldValue = intentField[fieldZ][fieldY][fieldX];
          
          // If using probabilistic intent, higher fluctuations increase likelihood of particle creation
          if (config.probabilisticIntent) {
            const threshold = 0.1 + config.intentFluctuationRate * 2;  
            // The stronger the fluctuation (positive or negative), the more likely to create a particle
            const fluctuationStrength = Math.abs(fieldValue);
            
            if (fluctuationStrength > threshold) {
              foundLocation = true;
            }
          } else {
            // Otherwise just accept the location
            foundLocation = true;
          }
        }
        
        attempts++;
      }
      
      if (!foundLocation) {
        // If we couldn't find a good spot, just pick a random one
        x = Math.random() * width;
        y = Math.random() * height;
        z = Math.random() * 9.9;
        
        const fieldX = Math.floor(x / (width / intentField[0][0].length));
        const fieldY = Math.floor(y / (height / intentField[0].length));
        const fieldZ = Math.floor(z / (10 / intentField.length));
        
        if (fieldZ < intentField.length && 
            fieldY < intentField[0].length && 
            fieldX < intentField[0][0].length) {
          fieldValue = intentField[fieldZ][fieldY][fieldX];
        } else {
          fieldValue = (Math.random() * 2) - 1; // Random value between -1 and 1
        }
      }
      
      // Create particle based on field fluctuation
      const newId = particlesRef.current.length > 0 ? 
        Math.max(...particlesRef.current.map(p => p.id)) + 1 : 0;
      
      const newParticle = createParticleFromField(fieldValue, x, y, z, newId);
      
      // Apply additional configuration based on simulation settings
      if (config.useAdaptiveParticles && Math.random() < 0.2) {
        newParticle.type = 'adaptive';
        newParticle.adaptiveScore = Math.random();
        // Adaptive particles have different colors
        newParticle.color = 'rgba(59, 130, 246, 0.8)'; // Blue-ish
      }
      
      // Add particle to the simulation
      particlesRef.current.push(newParticle);
    }
  }, [config, running, isInitialized, particlesRef, intentFieldRef, dimensionsRef]);

  return { createNewParticles };
}
