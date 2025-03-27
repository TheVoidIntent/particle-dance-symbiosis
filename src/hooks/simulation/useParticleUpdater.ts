
import { useCallback } from 'react';
import { updateIntentField } from '@/utils/fields';
import { SimulationConfig } from './types';

export function useParticleUpdater(
  config: SimulationConfig,
  running: boolean,
  isInitialized: boolean,
  particlesRef: React.MutableRefObject<any[]>,
  intentFieldRef: React.MutableRefObject<number[][][]>,
  dimensionsRef: React.MutableRefObject<{ width: number; height: number }>,
  frameCountRef: React.MutableRefObject<number>,
  simulationTimeRef: React.MutableRefObject<number>,
  checkInflationConditions: () => void
) {
  const updateParticles = useCallback(() => {
    if (!running || !isInitialized || particlesRef.current.length === 0) {
      return particlesRef.current;
    }

    // Update intent field with fluctuations
    intentFieldRef.current = updateIntentField(
      intentFieldRef.current, 
      config.intentFluctuationRate,
      config.probabilisticIntent
    );

    // Apply particle physics and interactions here
    // This is a placeholder for actual particle simulation logic
    const updatedParticles = particlesRef.current.map(particle => {
      // Basic particle movement and field interaction logic
      const newX = particle.x + particle.vx;
      const newY = particle.y + particle.vy;
      const newZ = particle.z + particle.vz;
      
      // Boundary checks
      const boundedX = Math.max(0, Math.min(dimensionsRef.current.width, newX));
      const boundedY = Math.max(0, Math.min(dimensionsRef.current.height, newY));
      const boundedZ = Math.max(0, Math.min(10, newZ));
      
      // Update velocity based on bounds
      const newVx = boundedX !== newX ? -particle.vx * 0.8 : particle.vx;
      const newVy = boundedY !== newY ? -particle.vy * 0.8 : particle.vy;
      const newVz = boundedZ !== newZ ? -particle.vz * 0.8 : particle.vz;
      
      return {
        ...particle,
        x: boundedX,
        y: boundedY,
        z: boundedZ,
        vx: newVx,
        vy: newVy,
        vz: newVz,
        // Apply intent decay if energy conservation is on
        intent: config.energyConservation 
          ? Math.max(0, particle.intent - particle.intentDecayRate)
          : particle.intent
      };
    });

    // Filter out particles with no energy if using energy conservation
    const filteredParticles = config.energyConservation
      ? updatedParticles.filter(p => p.energy > 0.1)
      : updatedParticles;
    
    particlesRef.current = filteredParticles;
    frameCountRef.current += 1;
    simulationTimeRef.current += 1;
    
    // Check for inflation conditions
    checkInflationConditions();

    return filteredParticles;
  }, [config, running, isInitialized, particlesRef, intentFieldRef, dimensionsRef, frameCountRef, simulationTimeRef, checkInflationConditions]);

  return { updateParticles };
}
