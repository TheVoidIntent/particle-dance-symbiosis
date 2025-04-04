
import { Particle } from '@/types/simulation';

/**
 * Calculates interaction between two particles
 */
export function calculateParticleInteraction(
  p1: Particle,
  p2: Particle,
  learningRate: number = 0.1,
  viewMode: '2d' | '3d' = '2d'
): [Particle, Particle, boolean] {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = viewMode === '3d' ? p2.z - p1.z : 0;
  
  const distanceSquared = dx * dx + dy * dy + dz * dz;
  const interactionRadius = (p1.radius + p2.radius) + 5;
  
  if (distanceSquared > interactionRadius * interactionRadius) {
    return [p1, p2, false];
  }
  
  const interactionProbability = p1.interactionTendency * p2.interactionTendency * 0.2;
  
  if (Math.random() > interactionProbability) {
    return [p1, p2, false];
  }
  
  const p1Knowledge = p1.knowledge || 0;
  const p2Knowledge = p2.knowledge || 0;
  
  const knowledgeDiff = Math.abs(p1Knowledge - p2Knowledge);
  const transferAmount = knowledgeDiff * learningRate;
  
  let newP1Knowledge = p1Knowledge;
  let newP2Knowledge = p2Knowledge;
  
  if (p1Knowledge > p2Knowledge) {
    newP1Knowledge -= transferAmount * 0.5;
    newP2Knowledge += transferAmount;
  } else {
    newP1Knowledge += transferAmount;
    newP2Knowledge -= transferAmount * 0.5;
  }
  
  const distance = Math.sqrt(distanceSquared);
  const strength = 0.1;
  
  const forceX = dx / distance * strength;
  const forceY = dy / distance * strength;
  const forceZ = dz / distance * strength;
  
  const updatedP1: Particle = {
    ...p1,
    vx: p1.vx - forceX,
    vy: p1.vy - forceY,
    vz: p1.vz - forceZ,
    knowledge: newP1Knowledge,
    interactions: (p1.interactions || 0) + 1,
    lastInteraction: Date.now()
  };
  
  const updatedP2: Particle = {
    ...p2,
    vx: p2.vx + forceX,
    vy: p2.vy + forceY,
    vz: p2.vz + forceZ,
    knowledge: newP2Knowledge,
    interactions: (p2.interactions || 0) + 1,
    lastInteraction: Date.now()
  };
  
  return [updatedP1, updatedP2, true];
}
