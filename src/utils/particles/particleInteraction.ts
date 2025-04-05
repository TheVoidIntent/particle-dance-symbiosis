
import { Particle } from '@/types/simulation';

/**
 * Calculates the interaction between two particles
 * 
 * @param particle1 First particle
 * @param particle2 Second particle
 * @param interactionRadius Maximum distance for interaction
 * @returns Boolean indicating if interaction occurred
 */
export function calculateParticleInteraction(
  particle1: Particle,
  particle2: Particle,
  interactionRadius: number
): boolean {
  // Calculate distance between particles
  const dx = particle2.x - particle1.x;
  const dy = particle2.y - particle1.y;
  const dz = (particle2.z || 0) - (particle1.z || 0);
  
  const distanceSquared = dx * dx + dy * dy + dz * dz;
  
  // Check if particles are close enough to interact
  if (distanceSquared > interactionRadius * interactionRadius) {
    return false;
  }
  
  // Calculate interaction based on charge
  const interactionFactor = calculateInteractionFactor(particle1, particle2);
  const distance = Math.sqrt(distanceSquared);
  
  // Apply interaction effects
  applyInteractionEffects(particle1, particle2, distance, interactionFactor);
  
  // Mark particles as having interacted
  particle1.interactionCount = (particle1.interactionCount || 0) + 1;
  particle2.interactionCount = (particle2.interactionCount || 0) + 1;
  particle1.lastInteraction = Date.now();
  particle2.lastInteraction = Date.now();
  particle1.interactions += 1;
  particle2.interactions += 1;
  
  // Knowledge exchange based on interaction
  const knowledgeTransfer = Math.min(particle1.knowledge || 0, particle2.knowledge || 0) * 0.1;
  particle1.knowledge = (particle1.knowledge || 0) + knowledgeTransfer;
  particle2.knowledge = (particle2.knowledge || 0) + knowledgeTransfer;
  
  // Complexity may increase with interactions
  particle1.complexity = Math.min(10, (particle1.complexity || 1) * 1.01);
  particle2.complexity = Math.min(10, (particle2.complexity || 1) * 1.01);
  
  return true;
}

/**
 * Calculate interaction factor based on particle charges
 */
function calculateInteractionFactor(particle1: Particle, particle2: Particle): number {
  if (particle1.charge === 'positive' && particle2.charge === 'positive') {
    return 0.5; // Positive-positive: moderate attraction
  } else if (particle1.charge === 'negative' && particle2.charge === 'negative') {
    return -0.3; // Negative-negative: weak repulsion
  } else if (
    (particle1.charge === 'positive' && particle2.charge === 'negative') ||
    (particle1.charge === 'negative' && particle2.charge === 'positive')
  ) {
    return 1.0; // Positive-negative: strong attraction
  } else if (particle1.charge === 'neutral' || particle2.charge === 'neutral') {
    return 0.1; // Any interaction with neutral: very weak attraction
  }
  
  return 0.2; // Default: weak attraction
}

/**
 * Apply interaction effects to particles
 */
function applyInteractionEffects(
  particle1: Particle,
  particle2: Particle,
  distance: number,
  interactionFactor: number
): void {
  // Prevent divide by zero
  if (distance < 0.1) distance = 0.1;
  
  // Calculate force magnitude (inverse square law)
  const forceMagnitude = interactionFactor / (distance * distance);
  
  // Calculate force components
  const dx = particle2.x - particle1.x;
  const dy = particle2.y - particle1.y;
  const dz = (particle2.z || 0) - (particle1.z || 0);
  
  // Normalize direction
  const forceX = (dx / distance) * forceMagnitude;
  const forceY = (dy / distance) * forceMagnitude;
  const forceZ = (dz / distance) * forceMagnitude;
  
  // Apply forces (action-reaction principle)
  particle1.vx += forceX * (1 / particle1.mass);
  particle1.vy += forceY * (1 / particle1.mass);
  particle1.vz = (particle1.vz || 0) + forceZ * (1 / particle1.mass);
  
  particle2.vx -= forceX * (1 / particle2.mass);
  particle2.vy -= forceY * (1 / particle2.mass);
  particle2.vz = (particle2.vz || 0) - forceZ * (1 / particle2.mass);
  
  // Apply energy exchanges
  const energyExchange = (particle1.energy - particle2.energy) * 0.05;
  particle1.energy -= energyExchange;
  particle2.energy += energyExchange;
}
