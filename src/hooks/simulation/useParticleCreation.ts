
import { useState, useCallback, useEffect } from 'react';
import { Particle } from './types';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

interface UseParticleCreationOptions {
  maxParticles: number;
  particleCreationRate: number;
  intentFluctuationRate: number;
  probabilisticIntent: boolean;
  running: boolean;
}

export function useParticleCreation({
  maxParticles,
  particleCreationRate,
  intentFluctuationRate,
  probabilisticIntent,
  running
}: UseParticleCreationOptions) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Create a new particle with properties based on environment
  const createNewParticles = useCallback((count: number = 1) => {
    if (particles.length >= maxParticles) return;
    
    setParticles(prevParticles => {
      const newParticles = [...prevParticles];
      
      for (let i = 0; i < count; i++) {
        if (newParticles.length >= maxParticles) break;
        
        // Determine particle properties based on fluctuation and intent
        const intent = Math.random() * 2 - 1; // Random intent between -1 and 1
        let charge: 'positive' | 'negative' | 'neutral';
        
        // Determine charge based on intent value with some randomness
        if (intent > 0.3) {
          charge = 'positive';
        } else if (intent < -0.3) {
          charge = 'negative';
        } else {
          charge = 'neutral';
        }
        
        // Add some randomness based on fluctuation rate
        if (Math.random() < intentFluctuationRate * 0.5) {
          // Sometimes override the charge determination with pure randomness
          const randomValue = Math.random();
          if (randomValue < 0.33) charge = 'positive';
          else if (randomValue < 0.66) charge = 'negative';
          else charge = 'neutral';
        }
        
        // Determine type based on complexity factors
        let type: 'standard' | 'high-energy' | 'quantum' | 'composite' | 'adaptive' = 'standard';
        
        // 10% chance of more complex particle types
        const typeRandom = Math.random();
        if (typeRandom < 0.05) {
          type = 'high-energy';
        } else if (typeRandom < 0.1) {
          type = 'quantum';
        } else if (typeRandom < 0.15 && newParticles.length > 10) {
          type = 'composite';
        } else if (typeRandom < 0.2) {
          type = 'adaptive';
        }
        
        // Set color based on charge and type
        let color = '';
        if (charge === 'positive') {
          color = type === 'standard' ? '#ef4444' : // Red for standard positive 
                 type === 'high-energy' ? '#f97316' : // Orange for high-energy positive
                 type === 'quantum' ? '#ec4899' : // Pink for quantum positive
                 type === 'composite' ? '#6366f1' : // Indigo for composite positive
                 '#8b5cf6'; // Purple for adaptive positive
        } else if (charge === 'negative') {
          color = type === 'standard' ? '#3b82f6' : // Blue for standard negative
                 type === 'high-energy' ? '#06b6d4' : // Cyan for high-energy negative
                 type === 'quantum' ? '#1e40af' : // Dark blue for quantum negative
                 type === 'composite' ? '#0891b2' : // Teal for composite negative
                 '#0d9488'; // Teal for adaptive negative
        } else {
          color = type === 'standard' ? '#84cc16' : // Green for standard neutral
                 type === 'high-energy' ? '#22c55e' : // Emerald for high-energy neutral
                 type === 'quantum' ? '#14b8a6' : // Teal for quantum neutral
                 type === 'composite' ? '#a3e635' : // Lime for composite neutral
                 '#fcd34d'; // Amber for adaptive neutral
        }
        
        // Add some saturation variation
        color = color + Math.floor(Math.random() * 33).toString(16); // Add slight random variation
        
        // Set mass based on type
        const mass = type === 'standard' ? 1.0 :
                     type === 'high-energy' ? 0.8 :
                     type === 'quantum' ? 0.5 :
                     type === 'composite' ? 1.5 :
                     1.2;
        
        // Create the new particle
        const newParticle: Particle = {
          id: Date.now() + Math.random(),
          x: Math.random() * 800,
          y: Math.random() * 600,
          z: Math.random() * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 2,
          radius: 5 + Math.random() * 3,
          mass,
          charge,
          type,
          color,
          knowledge: 0,
          complexity: type === 'composite' ? 2 + Math.random() * 3 : 1,
          intent: intent * (probabilisticIntent ? Math.random() : 1),
          age: 0,
          interactions: 0,
          interactionCount: 0,
          lastInteraction: 0,
          intentDecayRate: 0.001 + Math.random() * 0.002,
          energy: 1.0,
          energyCapacity: 1.0,
          created: Date.now()
        };
        
        // Play creation sound occasionally (10% chance to avoid too many sounds)
        if (Math.random() < 0.1) {
          playSimulationEvent('particle_creation', { charge });
        }
        
        newParticles.push(newParticle);
      }
      
      return newParticles;
    });
  }, [particles.length, maxParticles, intentFluctuationRate, probabilisticIntent]);
  
  // Initialize with some particles when simulation starts
  useEffect(() => {
    if (running && particles.length === 0) {
      const initialCount = Math.min(5, maxParticles);
      createNewParticles(initialCount);
    }
  }, [running, particles.length, maxParticles, createNewParticles]);
  
  return {
    particles,
    setParticles,
    createNewParticles
  };
}
