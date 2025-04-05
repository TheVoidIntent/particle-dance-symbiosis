
import { Particle, ParticleType } from '@/types/simulation';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new particle with specified properties
 */
export function createParticle(
  x: number,
  y: number,
  options: {
    charge?: 'positive' | 'negative' | 'neutral';
    type?: ParticleType;
    radius?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    mass?: number;
    interactionTendency?: number;
    knowledge?: number;
    complexity?: number;
    intentValue?: number;
    energy?: number;
  } = {}
): Particle {
  const {
    charge = Math.random() > 0.66 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral',
    type = 'standard' as ParticleType,
    radius = Math.random() * 3 + 2,
    vx = (Math.random() - 0.5) * 2,
    vy = (Math.random() - 0.5) * 2,
    vz = (Math.random() - 0.5) * 2,
    mass = Math.random() * 5 + 1,
    interactionTendency = charge === 'positive' ? 0.8 : charge === 'negative' ? 0.3 : 0.5,
    knowledge = Math.random() * 0.3,
    complexity = 1.0,
    intentValue = Math.random() * 2 - 1,
    energy = Math.random() * 0.7 + 0.3
  } = options;

  return {
    id: uuidv4(),
    x,
    y,
    z: 0,
    vx,
    vy,
    vz,
    radius,
    mass,
    charge,
    type,
    interactionTendency,
    knowledge,
    complexity,
    intentValue,
    energy,
    interactions: 0,
    lastInteraction: 0,
    clusterID: null,  // This was missing and causing the error
    age: 0
  };
}
