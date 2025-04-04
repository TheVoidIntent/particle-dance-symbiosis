
import { v4 as uuidv4 } from 'uuid';
import { Particle, ParticleType } from '@/types/simulation';

/**
 * Creates a particle from an intent field value
 */
export function createParticleFromField(
  fieldValue: number,
  x: number,
  y: number,
  z: number,
  timestamp: number
): Particle {
  let charge: 'positive' | 'negative' | 'neutral';
  let color: string;
  let interactionTendency: number;
  
  if (fieldValue > 0.2) {
    charge = 'positive';
    color = 'rgba(239, 68, 68, 0.8)';
    interactionTendency = 0.7 + fieldValue * 0.3;
  } else if (fieldValue < -0.2) {
    charge = 'negative';
    color = 'rgba(147, 51, 234, 0.8)';
    interactionTendency = 0.3 + Math.abs(fieldValue) * 0.2;
  } else {
    charge = 'neutral';
    color = 'rgba(74, 222, 128, 0.8)';
    interactionTendency = 0.5;
  }
  
  let type: ParticleType = 'regular';
  
  if (Math.abs(fieldValue) > 0.8) {
    type = 'high-energy';
  } else if (Math.random() < 0.05) {
    type = Math.random() < 0.5 ? 'quantum' : 'composite';
  }
  
  const radius = 3 + Math.random() * 2;
  const size = radius * 2;
  
  return {
    id: uuidv4(),
    x,
    y,
    z,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    vz: (Math.random() - 0.5) * 0.5,
    charge,
    radius,
    size,
    color,
    intent: fieldValue,
    interactionTendency,
    knowledge: 0.1 + Math.random() * 0.2,
    complexity: 1,
    energy: 1 + Math.abs(fieldValue),
    type,
    age: 0,
    mass: 1,
    scale: 1,
    created: timestamp,
    creationTime: timestamp,
    interactions: 0,
    intentDecayRate: 0.001,
    adaptiveScore: 0,
    energyCapacity: 1 + Math.abs(fieldValue) * 1.2,
    isPostInflation: false,
    lastInteraction: 0,
    interactionCount: 0
  };
}

/**
 * Creates a generic particle with specified properties
 */
export function createParticle(
  x: number,
  y: number,
  z: number,
  charge: 'positive' | 'negative' | 'neutral',
  type: ParticleType,
  timestamp: number
): Particle {
  const radius = 3 + Math.random() * 2;
  const size = radius * 2;
  
  return {
    id: uuidv4(),
    x,
    y,
    z,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    vz: (Math.random() - 0.5) * 0.5,
    charge,
    radius,
    size,
    color: charge === 'positive' 
      ? 'rgba(239, 68, 68, 0.8)' 
      : charge === 'negative' 
        ? 'rgba(147, 51, 234, 0.8)' 
        : 'rgba(74, 222, 128, 0.8)',
    intent: Math.random() * 2 - 1,
    interactionTendency: charge === 'positive' ? 0.7 : charge === 'negative' ? 0.3 : 0.5,
    knowledge: 0.1 + Math.random() * 0.2,
    complexity: 1,
    energy: 1 + Math.random(),
    type,
    age: 0,
    mass: 1,
    scale: 1,
    created: timestamp,
    creationTime: timestamp,
    interactions: 0,
    intentDecayRate: 0.001,
    adaptiveScore: 0,
    energyCapacity: (1 + Math.random()) * 1.2,
    isPostInflation: false,
    lastInteraction: 0,
    interactionCount: 0
  };
}
