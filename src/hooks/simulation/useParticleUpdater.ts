
import { MutableRefObject, useCallback } from 'react';
import { Particle } from '@/types/simulation';

/**
 * Hook for updating particles in the simulation
 */
export function useParticleUpdater(
  particlesRef: MutableRefObject<Particle[]>,
  intentFieldRef: MutableRefObject<number[][][]>,
  interactionsRef: MutableRefObject<number>,
  canvasWidth: number,
  canvasHeight: number
) {
  /**
   * Update a particle's position based on its velocity
   */
  const updateParticlePosition = useCallback((particle: Particle): Particle => {
    const { x, y, vx, vy, radius } = particle;
    
    // Calculate new position
    let newX = x + vx;
    let newY = y + vy;
    
    // Bounce off walls
    let newVx = vx;
    let newVy = vy;
    
    if (newX - radius < 0) {
      newX = radius;
      newVx = -vx * 0.8; // Reduce velocity a bit
    } else if (newX + radius > canvasWidth) {
      newX = canvasWidth - radius;
      newVx = -vx * 0.8;
    }
    
    if (newY - radius < 0) {
      newY = radius;
      newVy = -vy * 0.8;
    } else if (newY + radius > canvasHeight) {
      newY = canvasHeight - radius;
      newVy = -vy * 0.8;
    }
    
    // Apply some friction/damping
    newVx *= 0.99;
    newVy *= 0.99;
    
    // Update particle's properties based on intent field
    // In a real implementation, this would interact with the intent field
    
    // Apply some small random fluctuations
    newVx += (Math.random() - 0.5) * 0.1;
    newVy += (Math.random() - 0.5) * 0.1;
    
    // Update age and decay energy if needed
    const age = (particle.age || 0) + 1;
    const energy = Math.max(0, (particle.energy || 100) - 0.01); // Slowly lose energy over time
    
    return {
      ...particle,
      x: newX,
      y: newY,
      vx: newVx,
      vy: newVy,
      age,
      energy
    };
  }, [canvasWidth, canvasHeight]);
  
  /**
   * Calculate interaction between two particles
   */
  const calculateParticleInteraction = useCallback((p1: Particle, p2: Particle): [Particle, Particle, boolean] => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // No interaction if particles are too far apart
    if (distance > p1.radius + p2.radius + 10) {
      return [p1, p2, false];
    }
    
    // Calculate if interaction should occur based on intent and interaction tendency
    const p1Intent = p1.intent || 0;
    const p2Intent = p2.intent || 0;
    const p1Tendency = p1.interactionTendency || 0.5;
    const p2Tendency = p2.interactionTendency || 0.5;
    
    const interactionThreshold = 0.3; // Adjust as needed
    const willInteract = Math.random() < (p1Tendency * p2Tendency) * interactionThreshold;
    
    if (!willInteract) {
      return [p1, p2, false];
    }
    
    // Calculate knowledge exchange
    const p1Knowledge = p1.knowledge || 0;
    const p2Knowledge = p2.knowledge || 0;
    
    // More knowledgeable particle shares with less knowledgeable
    const knowledgeDiff = Math.abs(p1Knowledge - p2Knowledge);
    const transferAmount = knowledgeDiff * 0.1; // 10% transfer rate
    
    let newP1Knowledge = p1Knowledge;
    let newP2Knowledge = p2Knowledge;
    
    if (p1Knowledge > p2Knowledge) {
      newP1Knowledge -= transferAmount * 0.5; // Lose some when teaching
      newP2Knowledge += transferAmount;
    } else {
      newP1Knowledge += transferAmount;
      newP2Knowledge -= transferAmount * 0.5;
    }
    
    // Update interaction counters
    const p1Interactions = (p1.interactions || 0) + 1;
    const p2Interactions = (p2.interactions || 0) + 1;
    
    // Update particles with new knowledge and interaction data
    const updatedP1: Particle = {
      ...p1,
      knowledge: newP1Knowledge,
      lastInteraction: Date.now(),
      interactionCount: (p1.interactionCount || 0) + 1,
      interactions: p1Interactions
    };
    
    const updatedP2: Particle = {
      ...p2,
      knowledge: newP2Knowledge,
      lastInteraction: Date.now(),
      interactionCount: (p2.interactionCount || 0) + 1,
      interactions: p2Interactions
    };
    
    // Update global interaction counter
    interactionsRef.current += 1;
    
    return [updatedP1, updatedP2, true];
  }, []);
  
  /**
   * Update all particles in the simulation
   */
  const updateAllParticles = useCallback(() => {
    if (particlesRef.current.length === 0) {
      return [];
    }
    
    const updatedParticles: Particle[] = [];
    
    // First update positions
    for (let i = 0; i < particlesRef.current.length; i++) {
      const updatedParticle = updateParticlePosition(particlesRef.current[i]);
      updatedParticles.push(updatedParticle);
    }
    
    // Then calculate interactions
    for (let i = 0; i < updatedParticles.length; i++) {
      for (let j = i + 1; j < updatedParticles.length; j++) {
        const [newP1, newP2, interacted] = calculateParticleInteraction(
          updatedParticles[i],
          updatedParticles[j]
        );
        
        updatedParticles[i] = newP1;
        updatedParticles[j] = newP2;
      }
    }
    
    particlesRef.current = updatedParticles;
    return updatedParticles;
  }, [updateParticlePosition, calculateParticleInteraction]);
  
  return {
    updateParticlePosition,
    calculateParticleInteraction,
    updateAllParticles
  };
}
