
import { Particle } from '../particleUtils';
import { simulationState, saveState } from './state';
import { defaultConfig, simulationDimensions } from './config';
import { createNewParticle } from './initialization';
import { playSimulationEvent } from '../audio/simulationAudioUtils';

// Update the simulation (main loop)
export function updateSimulation() {
  // Update frame count and time
  simulationState.frameCount++;
  simulationState.simulationTime++;
  
  // Skip update if no particles or intent field
  if (!simulationState.particles.length || !simulationState.intentField.length) {
    console.log("No particles or intent field to update");
    return;
  }
  
  // Log info occasionally to check if simulation is running
  if (simulationState.frameCount % 1000 === 0) {
    console.log(`🔄 Simulation running: Frame ${simulationState.frameCount}, ${simulationState.particles.length} particles, ${simulationState.interactionsCount} interactions`);
  }
  
  try {
    // Update particles (positions, interactions, etc.)
    updateParticlesPositions();
    calculateParticleInteractions();
    
    // Update intent field occasionally
    if (simulationState.frameCount % 5 === 0) {
      updateIntentFieldPeriodically();
    }
    
    // Save state occasionally to prevent data loss
    if (simulationState.frameCount % 500 === 0) {
      saveState();
    }
  } catch (error) {
    console.error("Error in simulation update:", error);
  }
}

// Update particles positions
function updateParticlesPositions() {
  const { width, height } = simulationDimensions;
  
  for (let i = 0; i < simulationState.particles.length; i++) {
    const particle = simulationState.particles[i];
    
    if (!particle) continue;
    
    // Update position based on velocity
    particle.x += particle.vx || 0;
    particle.y += particle.vy || 0;
    particle.z += particle.vz || 0;
    
    // Apply boundaries (wrap around)
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;
    if (particle.z < 0) particle.z = 10;
    if (particle.z > 10) particle.z = 0;
    
    // Apply intent field influence
    applyIntentFieldToParticle(particle);
    
    // Apply random motion for liveliness
    particle.vx += (Math.random() - 0.5) * 0.1;
    particle.vy += (Math.random() - 0.5) * 0.1;
    
    // Apply drag
    particle.vx *= 0.98;
    particle.vy *= 0.98;
    
    // Update age
    particle.age = (particle.age || 0) + 1;
  }
}

// Apply intent field forces to a particle
function applyIntentFieldToParticle(particle: Particle) {
  const { width, height } = simulationDimensions;
  const fieldWidth = simulationState.intentField[0][0].length;
  const fieldHeight = simulationState.intentField[0].length;
  const fieldDepth = simulationState.intentField.length;
  
  const fieldX = Math.floor(particle.x / (width / fieldWidth));
  const fieldY = Math.floor(particle.y / (height / fieldHeight));
  const fieldZ = Math.floor(particle.z / (10 / fieldDepth));
  
  const safeFieldX = Math.max(0, Math.min(fieldWidth - 1, fieldX));
  const safeFieldY = Math.max(0, Math.min(fieldHeight - 1, fieldY));
  const safeFieldZ = Math.max(0, Math.min(fieldDepth - 1, fieldZ));
  
  const intentValue = simulationState.intentField[safeFieldZ][safeFieldY][safeFieldX];
  
  // Apply force based on intent value and particle charge
  const forceFactor = 0.01;
  let multiplier = 1;
  
  if (particle.charge === 'positive') {
    // Positive charges are attracted to positive intent
    multiplier = intentValue > 0 ? 1 : -0.5;
  } else if (particle.charge === 'negative') {
    // Negative charges are attracted to negative intent
    multiplier = intentValue < 0 ? 1 : -0.5;
  } else {
    // Neutral charges move more randomly
    multiplier = intentValue * 0.5;
  }
  
  particle.vx += intentValue * forceFactor * multiplier;
  particle.vy += intentValue * forceFactor * multiplier;
  
  // Update particle's own intent based on field
  if (particle.intent !== undefined) {
    particle.intent = particle.intent * 0.99 + intentValue * 0.01;
  }
}

// Calculate interactions between particles
function calculateParticleInteractions() {
  const interactionRadius = 10;
  let interactionCount = 0;
  
  for (let i = 0; i < simulationState.particles.length; i++) {
    const p1 = simulationState.particles[i];
    
    if (!p1) continue;
    
    for (let j = i + 1; j < simulationState.particles.length; j++) {
      const p2 = simulationState.particles[j];
      
      if (!p2) continue;
      
      // Calculate distance
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distanceSquared = dx * dx + dy * dy;
      
      // Skip if too far apart
      if (distanceSquared > interactionRadius * interactionRadius) continue;
      
      // Calculate if interaction should occur based on charges
      let interactionProbability = 0.1; // Base chance
      
      if (p1.charge === 'positive' && p2.charge === 'positive') {
        interactionProbability = 0.3; // Higher for two positive charges
      } else if (p1.charge === 'negative' && p2.charge === 'negative') {
        interactionProbability = 0.05; // Lower for two negative charges
      }
      
      if (Math.random() < interactionProbability) {
        // Knowledge exchange
        if (p1.knowledge !== undefined && p2.knowledge !== undefined) {
          // Higher knowledge particle teaches the lower one
          if (p1.knowledge > p2.knowledge) {
            p2.knowledge = p2.knowledge * 0.95 + p1.knowledge * 0.05;
            p1.knowledge = p1.knowledge * 0.99; // Small loss when teaching
          } else {
            p1.knowledge = p1.knowledge * 0.95 + p2.knowledge * 0.05;
            p2.knowledge = p2.knowledge * 0.99;
          }
        }
        
        // Increment interaction counts
        p1.interactions = (p1.interactions || 0) + 1;
        p2.interactions = (p2.interactions || 0) + 1;
        
        // Apply small repulsive force
        const distance = Math.sqrt(distanceSquared);
        const force = 0.1 / Math.max(0.1, distance);
        const forceX = dx / distance * force;
        const forceY = dy / distance * force;
        
        p1.vx -= forceX;
        p1.vy -= forceY;
        p2.vx += forceX;
        p2.vy += forceY;
        
        interactionCount++;
      }
    }
  }
  
  // Update global interaction count
  simulationState.interactionsCount += interactionCount;
}

// Update intent field based on random fluctuations and particles
export function updateIntentFieldPeriodically() {
  // Skip if no intent field
  if (!simulationState.intentField.length) {
    console.log("No intent field to update");
    return;
  }
  
  const fieldWidth = simulationState.intentField[0][0].length;
  const fieldHeight = simulationState.intentField[0].length;
  const fieldDepth = simulationState.intentField.length;
  
  // Apply random fluctuations
  for (let z = 0; z < fieldDepth; z++) {
    for (let y = 0; y < fieldHeight; y++) {
      for (let x = 0; x < fieldWidth; x++) {
        // Random fluctuation
        const fluctuation = (Math.random() * 2 - 1) * 0.01;
        simulationState.intentField[z][y][x] += fluctuation;
        
        // Clamp to range [-1, 1]
        simulationState.intentField[z][y][x] = Math.max(-1, Math.min(1, simulationState.intentField[z][y][x]));
      }
    }
  }
  
  // Apply particle influence on intent field
  const { width, height } = simulationDimensions;
  
  for (const particle of simulationState.particles) {
    if (!particle) continue;
    
    const fieldX = Math.floor(particle.x / (width / fieldWidth));
    const fieldY = Math.floor(particle.y / (height / fieldHeight));
    const fieldZ = Math.floor(particle.z / (10 / fieldDepth));
    
    // Skip if out of bounds
    if (fieldX < 0 || fieldX >= fieldWidth || fieldY < 0 || fieldY >= fieldHeight || fieldZ < 0 || fieldZ >= fieldDepth) {
      continue;
    }
    
    // Particles influence the intent field based on their charge
    let influence = 0.001;
    if (particle.charge === 'positive') {
      influence = 0.002; // Positive particles create positive intent
    } else if (particle.charge === 'negative') {
      influence = -0.002; // Negative particles create negative intent
    } else {
      // Neutral particles stabilize intent (push towards 0)
      const currentValue = simulationState.intentField[fieldZ][fieldY][fieldX];
      simulationState.intentField[fieldZ][fieldY][fieldX] = currentValue * 0.999;
      continue;
    }
    
    // Apply influence to field
    simulationState.intentField[fieldZ][fieldY][fieldX] += influence;
    
    // Clamp to valid range
    simulationState.intentField[fieldZ][fieldY][fieldX] = Math.max(
      -1, 
      Math.min(1, simulationState.intentField[fieldZ][fieldY][fieldX])
    );
  }
}

// Create new particles from fluctuations
export function maybeCreateParticles() {
  // Check if we should create particles
  if (simulationState.particles.length >= defaultConfig.maxParticles) {
    return;
  }
  
  // Random chance to create particles based on config
  if (Math.random() < defaultConfig.particleCreationRate) {
    const newCount = Math.floor(Math.random() * 3) + 1; // 1-3 particles at a time
    
    for (let i = 0; i < newCount; i++) {
      // Create a new particle at a random position with attributes 
      // determined by the intent field
      const newParticle = createNewParticle(simulationState.frameCount + i);
      simulationState.particles.push(newParticle);
      
      // Play sound for particle creation
      if (i === 0) {
        playSimulationEvent('particle_creation', { intensity: 0.5 });
      }
    }
    
    console.log(`Created ${newCount} new particles. Total: ${simulationState.particles.length}`);
  }
}
