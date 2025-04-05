
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
  
  // Create beautiful, vibrant colors based on charge and field value intensity
  let color = '#FFFFFF'; // default: white
  
  if (charge === 'positive') {
    // Vibrant, bright colors for positive charges
    const hue = 180 + Math.floor(fieldValue * 60); // cyan to blue range
    const saturation = 80 + Math.floor(Math.random() * 20); // high saturation
    const lightness = 50 + Math.floor(Math.random() * 20); // medium to high brightness
    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  } else if (charge === 'negative') {
    // Warm colors for negative charges
    const hue = 0 + Math.floor(Math.random() * 60); // red to orange range
    const saturation = 80 + Math.floor(Math.random() * 20); // high saturation
    const lightness = 50 + Math.floor(Math.random() * 20); // medium to high brightness
    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  } else {
    // Purple/violet range for neutral charges
    const hue = 260 + Math.floor(Math.random() * 40); // purple violet range
    const saturation = 70 + Math.floor(Math.random() * 20); // medium-high saturation
    const lightness = 50 + Math.floor(Math.random() * 20); // medium to high brightness
    color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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
  
  // Calculate energy based on field fluctuation intensity with some randomness
  const energy = 1 + Math.abs(fieldValue) * Math.random() * 3;
  
  // Calculate radius based on energy - bigger particles have more energy
  const radius = 2 + energy * 0.7;
  
  // Create the particle with all required properties
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
    energyCapacity: energy * 1.5,
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
