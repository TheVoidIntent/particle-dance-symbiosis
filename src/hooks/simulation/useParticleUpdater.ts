
import { useCallback } from 'react';
import { MutableRefObject } from 'react';
import { updateIntentField } from '@/utils/fields';
import { Particle } from './types';
import { SimulationConfig } from './types';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

export function useParticleUpdater(
  config: SimulationConfig,
  running: boolean,
  isInitialized: boolean,
  particlesRef: MutableRefObject<Particle[]>,
  intentFieldRef: MutableRefObject<number[][][]>,
  dimensionsRef: MutableRefObject<{ width: number; height: number }>,
  frameCountRef: MutableRefObject<number>,
  simulationTimeRef: MutableRefObject<number>,
  checkInflationConditions: () => void
) {
  // Update particle positions, interactions, etc.
  const updateParticles = useCallback(() => {
    if (!running || !isInitialized || !intentFieldRef.current || !particlesRef.current) {
      return;
    }
    
    frameCountRef.current += 1;
    simulationTimeRef.current += 1;
    
    const particles = particlesRef.current;
    const dimensions = dimensionsRef.current;
    
    // Update intent field with fluctuations
    if (frameCountRef.current % 10 === 0) {
      intentFieldRef.current = updateIntentField(
        intentFieldRef.current, 
        config.intentFluctuationRate, 
        config.probabilisticIntent || false
      );
      
      // Occasionally play field fluctuation sound (1% chance to avoid sound overload)
      if (Math.random() < 0.01) {
        // Get a random area of the field to sample
        const z = Math.floor(Math.random() * intentFieldRef.current.length);
        const y = Math.floor(Math.random() * intentFieldRef.current[z].length);
        const x = Math.floor(Math.random() * intentFieldRef.current[z][y].length);
        const intentStrength = intentFieldRef.current[z][y][x];
        
        if (Math.abs(intentStrength) > 0.5) {
          playSimulationEvent('field_fluctuation', { intentStrength });
        }
      }
    }
    
    // Process each particle
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Update position based on velocity
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz || 0;
      
      // Apply boundary conditions
      if (p.x < 0 || p.x > dimensions.width) p.vx = -p.vx * 0.9;
      if (p.y < 0 || p.y > dimensions.height) p.vy = -p.vy * 0.9;
      if ((p.z || 0) < 0 || (p.z || 0) > 10) p.vz = -(p.vz || 0) * 0.9;
      
      p.x = Math.max(0, Math.min(dimensions.width, p.x));
      p.y = Math.max(0, Math.min(dimensions.height, p.y));
      p.z = Math.max(0, Math.min(10, p.z || 0));
      
      // Find closest point in intent field
      const fieldWidth = intentFieldRef.current[0][0].length;
      const fieldHeight = intentFieldRef.current[0].length;
      const fieldDepth = intentFieldRef.current.length;
      
      const cellSizeX = dimensions.width / fieldWidth;
      const cellSizeY = dimensions.height / fieldHeight;
      const cellSizeZ = 10 / fieldDepth;
      
      const fieldX = Math.min(fieldWidth - 1, Math.max(0, Math.floor(p.x / cellSizeX)));
      const fieldY = Math.min(fieldHeight - 1, Math.max(0, Math.floor(p.y / cellSizeY)));
      const fieldZ = Math.min(fieldDepth - 1, Math.max(0, Math.floor((p.z || 0) / cellSizeZ)));
      
      // Apply intent field influence on velocity
      const fieldValue = intentFieldRef.current[fieldZ][fieldY][fieldX];
      
      // Different particle types respond differently to the intent field
      let fieldMultiplier = 0.01;
      
      switch (p.type) {
        case 'high-energy':
          fieldMultiplier = 0.02; // More responsive
          break;
        case 'quantum':
          fieldMultiplier = 0.005 * Math.cos(frameCountRef.current * 0.1); // Oscillating response
          break;
        case 'composite':
          fieldMultiplier = 0.015 * (1 + p.complexity / 5); // Response increases with complexity
          break;
        case 'adaptive':
          fieldMultiplier = p.adaptiveScore ? 0.01 * (1 + p.adaptiveScore) : 0.01; // Adapts based on success
          break;
      }
      
      // Apply charge-based response to intent field
      switch (p.charge) {
        case 'positive':
          // Positive particles are attracted to positive field values
          p.vx += fieldValue * fieldMultiplier;
          p.vy += fieldValue * fieldMultiplier;
          break;
        case 'negative':
          // Negative particles are attracted to negative field values
          p.vx += -fieldValue * fieldMultiplier;
          p.vy += -fieldValue * fieldMultiplier;
          break;
        case 'neutral':
          // Neutral particles are influenced by field gradient
          if (fieldX > 0 && fieldX < fieldWidth - 1) {
            const gradientX = intentFieldRef.current[fieldZ][fieldY][fieldX + 1] - 
                              intentFieldRef.current[fieldZ][fieldY][fieldX - 1];
            p.vx += gradientX * fieldMultiplier * 0.5;
          }
          if (fieldY > 0 && fieldY < fieldHeight - 1) {
            const gradientY = intentFieldRef.current[fieldZ][fieldY + 1][fieldX] - 
                              intentFieldRef.current[fieldZ][fieldY - 1][fieldX];
            p.vy += gradientY * fieldMultiplier * 0.5;
          }
          break;
      }
      
      // Add some random motion
      p.vx += (Math.random() - 0.5) * 0.1;
      p.vy += (Math.random() - 0.5) * 0.1;
      if (p.vz !== undefined) p.vz += (Math.random() - 0.5) * 0.05;
      
      // Apply damping
      p.vx *= 0.98;
      p.vy *= 0.98;
      if (p.vz !== undefined) p.vz *= 0.98;
      
      // Increment age
      p.age = (p.age || 0) + 1;
      
      // Decay intent over time
      p.intent = p.intent * (1 - (p.intentDecayRate || 0.001));
      
      // Occasionally update energy based on intent field alignment
      if (Math.random() < 0.05) {
        const intentAlignment = p.charge === 'positive' ? fieldValue : 
                               p.charge === 'negative' ? -fieldValue : 0;
        p.energy = Math.min(p.energyCapacity, p.energy + (intentAlignment * 0.01));
      }
    }
    
    // Handle particle interactions
    const interactionEvents = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = (p2.z || 0) - (p1.z || 0);
        
        // Calculate squared distance (more efficient than taking square root)
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        const minDistance = p1.radius + p2.radius;
        
        if (distanceSquared < minDistance * minDistance) {
          // Particles are interacting
          
          // Record interaction
          p1.interactions = (p1.interactions || 0) + 1;
          p2.interactions = (p2.interactions || 0) + 1;
          p1.lastInteraction = Date.now();
          p2.lastInteraction = Date.now();
          p1.interactionCount = (p1.interactionCount || 0) + 1;
          p2.interactionCount = (p2.interactionCount || 0) + 1;
          
          // Handle knowledge exchange based on particle types and charges
          // Different charge combinations have different knowledge exchange effects
          let p1KnowledgeGain = 0;
          let p2KnowledgeGain = 0;
          
          if (p1.charge === p2.charge) {
            // Same charge - less effective knowledge exchange
            p1KnowledgeGain = 0.01 * (p2.knowledge || 0);
            p2KnowledgeGain = 0.01 * (p1.knowledge || 0);
          } else if ((p1.charge === 'positive' && p2.charge === 'negative') || 
                     (p1.charge === 'negative' && p2.charge === 'positive')) {
            // Opposite charges - enhanced knowledge exchange
            p1KnowledgeGain = 0.05 * (p2.knowledge || 0);
            p2KnowledgeGain = 0.05 * (p1.knowledge || 0);
          } else {
            // One neutral - moderate knowledge exchange
            p1KnowledgeGain = 0.025 * (p2.knowledge || 0);
            p2KnowledgeGain = 0.025 * (p1.knowledge || 0);
          }
          
          // Apply knowledge exchange
          p1.knowledge = (p1.knowledge || 0) + p1KnowledgeGain;
          p2.knowledge = (p2.knowledge || 0) + p2KnowledgeGain;
          
          // Energy exchange
          if (config.energyConservation) {
            const energyTransfer = 0.1 * Math.min(p1.energy || 0, p2.energy || 0);
            p1.energy = (p1.energy || 0) - energyTransfer;
            p2.energy = (p2.energy || 0) + energyTransfer;
          }
          
          // Complexity evolution for composite particles
          if (p1.type === 'composite' || p2.type === 'composite') {
            if (p1.type === 'composite') {
              p1.complexity = (p1.complexity || 1) + 0.01;
            }
            if (p2.type === 'composite') {
              p2.complexity = (p2.complexity || 1) + 0.01;
            }
          }
          
          // Handle physical collision effects - simplified
          const distance = Math.sqrt(distanceSquared);
          const nx = dx / distance;
          const ny = dy / distance;
          const nz = dz / distance;
          
          // Calculate relative velocity
          const vx = p2.vx - p1.vx;
          const vy = p2.vy - p1.vy;
          const vz = (p2.vz || 0) - (p1.vz || 0);
          
          // Calculate dot product
          const dotProduct = nx * vx + ny * vy + nz * vz;
          
          // Only bounce if particles are moving toward each other
          if (dotProduct < 0) {
            // Calculate impulse
            const damping = 0.9; // Some energy loss
            const impulse = 2 * dotProduct * damping;
            
            // Apply impulse based on mass
            const m1 = p1.mass || 1;
            const m2 = p2.mass || 1;
            const m1Ratio = m2 / (m1 + m2);
            const m2Ratio = m1 / (m1 + m2);
            
            p1.vx += impulse * nx * m1Ratio;
            p1.vy += impulse * ny * m1Ratio;
            if (p1.vz !== undefined) p1.vz += impulse * nz * m1Ratio;
            
            p2.vx -= impulse * nx * m2Ratio;
            p2.vy -= impulse * ny * m2Ratio;
            if (p2.vz !== undefined) p2.vz -= impulse * nz * m2Ratio;
            
            // Calculate interaction intensity for audio
            const interactionIntensity = Math.abs(dotProduct) / 10;
            
            // Record audio-worthy interaction events (but limit to avoid too many sounds)
            if (interactionIntensity > 0.3 && Math.random() < 0.1) {
              interactionEvents.push({
                intensity: interactionIntensity,
                charge1: p1.charge,
                charge2: p2.charge
              });
            }
          }
        }
      }
    }
    
    // Play a random interaction sound from the recorded events
    if (interactionEvents.length > 0 && Math.random() < 0.3) {
      const randomEvent = interactionEvents[Math.floor(Math.random() * interactionEvents.length)];
      playSimulationEvent('particle_interaction', randomEvent);
    }
    
    // Remove dead particles if energy conservation is enabled
    if (config.energyConservation) {
      particlesRef.current = particles.filter(p => (p.energy || 0) > 0.1);
    }
    
    // Occasionally check for inflation conditions
    if (frameCountRef.current % 30 === 0) {
      checkInflationConditions();
    }
    
  }, [
    running, 
    isInitialized, 
    dimensionsRef, 
    particlesRef, 
    intentFieldRef,
    frameCountRef,
    simulationTimeRef,
    config.intentFluctuationRate,
    config.probabilisticIntent,
    config.energyConservation,
    checkInflationConditions
  ]);
  
  return { updateParticles };
}
