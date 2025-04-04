
import { MutableRefObject } from 'react';
import { Particle, ParticleType } from '@/types/simulation';
import useAudioEvents from './useAudioEvents';

export interface ParticleCreationOptions {
  type?: ParticleType;
  charge?: string;
  maxVelocity?: number;
  maxIntent?: number;
  maxEnergy?: number;
  maxComplexity?: number;
  isPostInflation?: boolean;
  x?: number;
  y?: number;
}

/**
 * Hook for creating particles in the simulation
 */
export function useParticleCreation(
  particlesRef: MutableRefObject<Particle[]>,
  canvasWidth: number,
  canvasHeight: number
) {
  const audioEvents = useAudioEvents();

  /**
   * Create a new particle with optional customization
   */
  const createParticle = (options: ParticleCreationOptions = {}): Particle => {
    const {
      type = 'regular' as ParticleType,
      charge = Math.random() > 0.6 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral',
      maxVelocity = 2,
      maxIntent = 10,
      maxEnergy = 100,
      maxComplexity = 5,
      isPostInflation = false,
      x = Math.random() * canvasWidth,
      y = Math.random() * canvasHeight
    } = options;
    
    // Generate random position within canvas if not provided
    const posX = x;
    const posY = y;
    
    // Generate random velocities
    const vx = (Math.random() - 0.5) * maxVelocity;
    const vy = (Math.random() - 0.5) * maxVelocity;
    
    // Set color based on charge
    let color = '#FFFFFF'; // default: white
    if (charge === 'positive') {
      color = '#FF5555'; // red
    } else if (charge === 'negative') {
      color = '#5555FF'; // blue
    } else {
      color = '#55FF55'; // green for neutral
    }
    
    // Calculate intent based on charge
    let intent = Math.random() * maxIntent;
    if (charge === 'positive') {
      intent *= 1.5; // positive charges have higher intent
    } else if (charge === 'negative') {
      intent *= 0.5; // negative charges have lower intent
    }
    
    // Generate energy level
    const energy = Math.random() * maxEnergy;
    
    // Generate complexity
    const complexity = Math.random() * maxComplexity;
    
    // Interaction tendency based on charge
    let interactionTendency = Math.random();
    if (charge === 'positive') {
      interactionTendency *= 1.5; // positive charges more likely to interact
    } else if (charge === 'negative') {
      interactionTendency *= 0.5; // negative charges less likely to interact
    }
    
    // Trigger audio event for particle creation
    audioEvents.playEventSound('particle_creation', Math.abs(intent) / maxIntent);
    
    // Generate a particle with all required and optional fields
    return {
      id: Date.now() + Math.floor(Math.random() * 10000) + '', // Convert to string for compatibility
      x: posX,
      y: posY,
      vx,
      vy,
      radius: 3 + Math.random() * 3, // random size between 3-6
      mass: 1 + Math.random() * 4,
      charge: charge as 'positive' | 'negative' | 'neutral', // Explicitly cast to the allowed values
      color,
      type,
      intent,
      energy,
      knowledge: 0, // starts with no knowledge
      complexity,
      interactionTendency,
      lastInteraction: 0,
      interactionCount: 0,
      z: Math.random() * 10, // random z position for 3D visualizations
      age: 0, // starts at age 0
      interactions: 0, // starts with no interactions
      intentDecayRate: 0.001 + Math.random() * 0.005,
      energyCapacity: maxEnergy * (0.8 + Math.random() * 0.4),
      created: Date.now(),
      isPostInflation,
      scale: 1,
      adaptiveScore: 0,
      creationTime: Date.now(),
      vz: (Math.random() - 0.5) * 0.5,
      clusterID: null // Adding the required clusterID property
    } as Particle;
  };
  
  /**
   * Add multiple particles to the simulation
   */
  const addParticles = (count: number, options: ParticleCreationOptions = {}): Particle[] => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const particle = createParticle(options);
      newParticles.push(particle);
    }
    
    particlesRef.current = [...particlesRef.current, ...newParticles];
    return newParticles;
  };
  
  return {
    createParticle,
    addParticles
  };
}

export default useParticleCreation;
