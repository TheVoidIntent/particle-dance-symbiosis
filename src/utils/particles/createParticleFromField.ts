
import { Particle } from '@/types/simulation';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a particle from an intent field fluctuation value
 * 
 * @param fieldValue The intent field value (-1 to 1) that influences particle properties
 * @param x X position on canvas
 * @param y Y position on canvas
 * @param z Z position (depth)
 * @param timestamp Creation timestamp
 * @returns A new particle
 */
export function createParticleFromField(
  fieldValue: number,
  x: number,
  y: number,
  z: number = 0,
  timestamp: number = Date.now()
): Particle {
  // Determine charge based on field value
  // Positive field values tend to create positive charges
  // Negative field values tend to create negative charges
  // Values near zero tend to create neutral charges
  let charge: 'positive' | 'negative' | 'neutral';
  
  if (fieldValue > 0.2) {
    charge = 'positive';
  } else if (fieldValue < -0.2) {
    charge = 'negative';
  } else {
    charge = 'neutral';
  }
  
  // Calculate velocities based on field gradient
  const velocityFactor = Math.abs(fieldValue) * 2;
  const vx = (Math.random() - 0.5) * velocityFactor;
  const vy = (Math.random() - 0.5) * velocityFactor;
  const vz = (Math.random() - 0.5) * velocityFactor * 0.5;
  
  // Set color based on charge
  let color = '#FFFFFF'; // default: white
  if (charge === 'positive') {
    color = '#4ECDC4'; // teal for positive
  } else if (charge === 'negative') {
    color = '#FF6B6B'; // red for negative
  } else {
    color = '#5E60CE'; // purple for neutral
  }
  
  // Calculate intent based on field value and charge
  let intent = fieldValue * 10;
  if (charge === 'positive') {
    intent *= 1.5; // positive charges have higher intent
  } else if (charge === 'negative') {
    intent *= 0.5; // negative charges have lower intent
  }
  
  // Calculate interaction tendency based on charge
  let interactionTendency = Math.random();
  if (charge === 'positive') {
    interactionTendency *= 1.5; // positive charges more likely to interact
  } else if (charge === 'negative') {
    interactionTendency *= 0.5; // negative charges less likely to interact
  }
  
  // Calculate energy based on field fluctuation intensity
  const energy = 1 + Math.abs(fieldValue) * Math.random() * 2;
  
  // Calculate radius based on energy
  const radius = 3 + energy * 0.5;
  
  // Create the particle
  return {
    id: uuidv4(),
    x,
    y,
    z,
    vx,
    vy,
    vz,
    radius,
    mass: 1 + Math.random() * 4,
    charge,
    color,
    intent,
    energy,
    knowledge: 0,
    complexity: 1 + Math.abs(fieldValue) * 2,
    interactionTendency,
    lastInteraction: 0,
    interactions: 0,
    age: 0,
    interactionCount: 0,
    intentDecayRate: 0.001 + Math.random() * 0.005,
    energyCapacity: energy * 1.2,
    created: timestamp,
    isPostInflation: false,
    scale: 1,
    adaptiveScore: 0,
    creationTime: timestamp,
    size: radius * 2,
    type: 'standard', // Default type
    clusterID: null, // No cluster initially
  };
}
