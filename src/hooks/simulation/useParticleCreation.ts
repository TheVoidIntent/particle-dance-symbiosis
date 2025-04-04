
import { MutableRefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Particle } from '@/types/simulation';
import { ParticleCreationOptions } from './types';

/**
 * Hook for creating particles in the simulation
 */
export function useParticleCreation(
  particlesRef: MutableRefObject<Particle[]>,
  canvasWidth: number,
  canvasHeight: number
) {
  /**
   * Create a new particle with optional customization
   */
  const createParticle = (options: ParticleCreationOptions = {}): Particle => {
    // Destructure with proper type definitions for all properties
    const {
      type = 'normal',
      charge = Math.random() > 0.6 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral',
      isPostInflation = false,
      x = Math.random() * canvasWidth,
      y = Math.random() * canvasHeight,
      z = Math.random() * 10,
      vx = (Math.random() - 0.5) * 2,
      vy = (Math.random() - 0.5) * 2,
      energy = Math.random() * 100,
      knowledge = 0,
      complexity = Math.random() * 5,
      intentValue = Math.random() * 10,
    } = options;
    
    // Generate random velocities if not provided
    const velocityX = vx !== undefined ? vx : (Math.random() - 0.5) * 2;
    const velocityY = vy !== undefined ? vy : (Math.random() - 0.5) * 2;
    const velocityZ = (Math.random() - 0.5) * 0.5;
    
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
    let intent = intentValue !== undefined ? intentValue : Math.random() * 10;
    if (charge === 'positive') {
      intent *= 1.5; // positive charges have higher intent
    } else if (charge === 'negative') {
      intent *= 0.5; // negative charges have lower intent
    }
    
    // Generate complexity
    const finalComplexity = complexity !== undefined ? complexity : Math.random() * 5;
    
    // Interaction tendency based on charge
    let interactionTendency = Math.random();
    if (charge === 'positive') {
      interactionTendency *= 1.5; // positive charges more likely to interact
    } else if (charge === 'negative') {
      interactionTendency *= 0.5; // negative charges less likely to interact
    }
    
    // Generate radius and set size based on it
    const radius = 3 + Math.random() * 3;
    const size = radius * 2; // Size is diameter
    
    // Generate a particle with all required fields
    return {
      id: uuidv4(),
      x,
      y,
      z,
      vx: velocityX,
      vy: velocityY,
      vz: velocityZ,
      radius,
      mass: 1 + Math.random() * 4,
      size, // Adding required size property
      charge: charge as 'positive' | 'negative' | 'neutral',
      color,
      type,
      intent,
      energy,
      knowledge,
      complexity: finalComplexity,
      interactionTendency,
      lastInteraction: 0,
      interactionCount: 0,
      age: 0,
      interactions: 0,
      intentDecayRate: 0.001 + Math.random() * 0.005,
      energyCapacity: energy * 1.2,
      created: Date.now(),
      isPostInflation,
      scale: 1,
      adaptiveScore: 0,
      creationTime: Date.now()
    };
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
