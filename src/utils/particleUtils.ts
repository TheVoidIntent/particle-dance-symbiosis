// Define the extended particle types and interfaces
export type ParticleType = 'standard' | 'high-energy' | 'quantum';
export type ParticleCharge = 'positive' | 'negative' | 'neutral';

export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  charge: ParticleCharge;
  color: string;
  size: number;
  intent: number;
  knowledge: number;
  type: ParticleType;
  energy: number;
  stability: number;
}

// Create a new particle based on an intent field value
export function createParticleFromField(
  fieldValue: number,
  x: number,
  y: number,
  z: number,
  id: number
): Particle {
  // Determine particle properties based on field value
  let charge: ParticleCharge;
  let color: string;
  let type: ParticleType = 'standard'; // Default type
  let energy = Math.random(); // Random initial energy
  let stability = Math.random() * 0.8 + 0.2; // Stability between 0.2 and 1.0
  
  // Determine charge based on intent field value
  if (fieldValue > 0.3) {
    charge = 'positive';
    color = 'rgba(52, 211, 153, 0.8)'; // Green for positive
  } else if (fieldValue < -0.3) {
    charge = 'negative';
    color = 'rgba(248, 113, 113, 0.8)'; // Red for negative
  } else {
    charge = 'neutral';
    color = 'rgba(209, 213, 219, 0.8)'; // Gray for neutral
  }
  
  // Randomly assign special particle types with small probability
  const typeRandom = Math.random();
  if (typeRandom > 0.95) { // 5% chance for high-energy particles
    type = 'high-energy';
    energy = 0.8 + Math.random() * 0.2; // Higher energy
    color = 'rgba(250, 204, 21, 0.85)'; // Yellow for high energy
    stability = 0.4 + Math.random() * 0.3; // Less stable
  } else if (typeRandom > 0.90) { // 5% chance for quantum particles
    type = 'quantum';
    color = 'rgba(168, 85, 247, 0.85)'; // Purple for quantum
    energy = 0.6 + Math.random() * 0.3;
    stability = 0.1 + Math.random() * 0.3; // Very unstable
  }
  
  // Create particle object
  return {
    id,
    x,
    y,
    z,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    vz: (Math.random() - 0.5) * 1,
    charge,
    color,
    size: Math.random() * 3 + 2,
    intent: fieldValue,
    knowledge: 0,
    type,
    energy,
    stability
  };
}

// Update a particle's position based on its properties
export function updateParticlePosition(
  particle: Particle,
  dimensions: { width: number; height: number },
  intentField: number[][][],
  viewMode: '2d' | '3d'
): Particle {
  const updatedParticle = { ...particle };
  
  // Update position
  updatedParticle.x += updatedParticle.vx;
  updatedParticle.y += updatedParticle.vy;
  updatedParticle.z += viewMode === '3d' ? updatedParticle.vz : 0;
  
  // Boundary checks with bounce
  if (updatedParticle.x < 0 || updatedParticle.x > dimensions.width) {
    updatedParticle.vx *= -1;
    updatedParticle.x = Math.max(0, Math.min(dimensions.width, updatedParticle.x));
  }
  if (updatedParticle.y < 0 || updatedParticle.y > dimensions.height) {
    updatedParticle.vy *= -1;
    updatedParticle.y = Math.max(0, Math.min(dimensions.height, updatedParticle.y));
  }
  if (updatedParticle.z < 0 || updatedParticle.z > 10) {
    updatedParticle.vz *= -1;
    updatedParticle.z = Math.max(0, Math.min(10, updatedParticle.z));
  }
  
  // Get intent field value at particle position
  try {
    const fieldX = Math.floor(updatedParticle.x / (dimensions.width / intentField[0][0].length));
    const fieldY = Math.floor(updatedParticle.y / (dimensions.height / intentField[0].length));
    const fieldZ = Math.floor(updatedParticle.z / (10 / intentField.length));
    
    const fieldValue = intentField[
      Math.min(fieldZ, intentField.length - 1)
    ][
      Math.min(fieldY, intentField[0].length - 1)
    ][
      Math.min(fieldX, intentField[0][0].length - 1)
    ];
    
    // Type-specific movement behaviors
    if (updatedParticle.type === 'standard') {
      // Standard particles are influenced by the intent field
      const influence = fieldValue * 0.01;
      updatedParticle.vx += influence * (Math.random() - 0.5);
      updatedParticle.vy += influence * (Math.random() - 0.5);
      if (viewMode === '3d') {
        updatedParticle.vz += influence * (Math.random() - 0.5) * 0.5;
      }
    } else if (updatedParticle.type === 'high-energy') {
      // High-energy particles move faster and are less influenced by the field
      const influence = fieldValue * 0.005;
      updatedParticle.vx += influence * (Math.random() - 0.5) + (Math.random() - 0.5) * 0.05;
      updatedParticle.vy += influence * (Math.random() - 0.5) + (Math.random() - 0.5) * 0.05;
      if (viewMode === '3d') {
        updatedParticle.vz += influence * (Math.random() - 0.5) * 0.5 + (Math.random() - 0.5) * 0.05;
      }
    } else if (updatedParticle.type === 'quantum') {
      // Quantum particles occasionally "teleport" small distances
      if (Math.random() > 0.98) { // 2% chance to "teleport"
        const teleportDistance = 20 * Math.random();
        const angle = Math.random() * Math.PI * 2;
        
        updatedParticle.x += Math.cos(angle) * teleportDistance;
        updatedParticle.y += Math.sin(angle) * teleportDistance;
        
        // Ensure within bounds after teleport
        updatedParticle.x = Math.max(0, Math.min(dimensions.width, updatedParticle.x));
        updatedParticle.y = Math.max(0, Math.min(dimensions.height, updatedParticle.y));
      }
      
      // Quantum particles are more erratic in their movement
      updatedParticle.vx += (Math.random() - 0.5) * 0.2;
      updatedParticle.vy += (Math.random() - 0.5) * 0.2;
      if (viewMode === '3d') {
        updatedParticle.vz += (Math.random() - 0.5) * 0.2;
      }
    }
    
    // Energy loss over time (based on stability)
    updatedParticle.energy *= (0.9999 + updatedParticle.stability * 0.0001);
    
    // Limit velocity based on particle charge and type
    let maxSpeed: number;
    
    if (updatedParticle.type === 'high-energy') {
      maxSpeed = 3; // High-energy particles move faster
    } else if (updatedParticle.type === 'quantum') {
      maxSpeed = updatedParticle.charge === 'positive' ? 2.5 : 
                updatedParticle.charge === 'negative' ? 1.5 : 2;
    } else {
      maxSpeed = updatedParticle.charge === 'positive' ? 2 : 
                updatedParticle.charge === 'negative' ? 1 : 1.5;
    }
    
    // Scale by energy level
    maxSpeed *= (0.5 + updatedParticle.energy * 0.5);
    
    const speed = Math.sqrt(updatedParticle.vx ** 2 + updatedParticle.vy ** 2 + updatedParticle.vz ** 2);
    if (speed > maxSpeed) {
      const factor = maxSpeed / speed;
      updatedParticle.vx *= factor;
      updatedParticle.vy *= factor;
      updatedParticle.vz *= factor;
    }
  } catch (error) {
    // Handle potential out-of-bounds errors
    console.log("Field access error", error);
  }
  
  return updatedParticle;
}

// Calculate interaction between two particles
export function calculateParticleInteraction(
  particle1: Particle,
  particle2: Particle,
  learningRate: number,
  viewMode: '2d' | '3d'
): [Particle, Particle, boolean] {
  const updatedParticle1 = { ...particle1 };
  const updatedParticle2 = { ...particle2 };
  let interactionOccurred = false;
  
  // Calculate distance between particles
  const dx = particle2.x - particle1.x;
  const dy = particle2.y - particle1.y;
  const dz = viewMode === '3d' ? particle2.z - particle1.z : 0;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Interaction range depends on particle types and sizes
  const baseInteractionRange = (particle1.size + particle2.size) * 4;
  
  // High energy particles have larger interaction ranges
  const energyFactor1 = particle1.type === 'high-energy' ? 1.5 : 1;
  const energyFactor2 = particle2.type === 'high-energy' ? 1.5 : 1;
  
  // Quantum particles have variable interaction ranges
  const quantumFactor1 = particle1.type === 'quantum' ? (0.5 + Math.random()) : 1;
  const quantumFactor2 = particle2.type === 'quantum' ? (0.5 + Math.random()) : 1;
  
  const interactionRange = baseInteractionRange * energyFactor1 * energyFactor2 * quantumFactor1 * quantumFactor2;
  
  if (distance < interactionRange) {
    interactionOccurred = true;
    
    // Base interaction strength influenced by learning rate
    const interactionStrength = learningRate / (distance + 0.1);
    
    // Type-specific interaction behaviors
    if (particle1.type === 'quantum' || particle2.type === 'quantum') {
      // Quantum particles have unpredictable interactions
      const quantumEffect = Math.random() * 2 - 1; // Random effect between -1 and 1
      
      if (quantumEffect > 0.7) {
        // Strong knowledge exchange
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.4;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.4;
        
        // Energy exchange
        const energyTransfer = (particle2.energy - particle1.energy) * 0.1;
        updatedParticle1.energy += energyTransfer;
        updatedParticle2.energy -= energyTransfer;
      } else if (quantumEffect < -0.7) {
        // Repulsion
        const force = interactionStrength * 0.2;
        updatedParticle1.vx -= dx * force;
        updatedParticle1.vy -= dy * force;
        updatedParticle2.vx += dx * force;
        updatedParticle2.vy += dy * force;
      }
    } else if (particle1.type === 'high-energy' || particle2.type === 'high-energy') {
      // High-energy particles boost knowledge exchange
      const energyBoost = particle1.type === 'high-energy' ? particle1.energy : particle2.energy;
      
      updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.3 * energyBoost;
      updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.3 * energyBoost;
      
      // Slight momentum boost
      const force = interactionStrength * 0.03 * energyBoost;
      updatedParticle1.vx += dx * force;
      updatedParticle1.vy += dy * force;
      updatedParticle2.vx -= dx * force;
      updatedParticle2.vy -= dy * force;
    } else {
      // Standard particle interactions based on charge combinations
      if (particle1.charge === 'positive' && particle2.charge === 'positive') {
        // Strong knowledge exchange for positive-positive
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.2;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.2;
        
        // Attraction
        const force = interactionStrength * 0.05;
        updatedParticle1.vx += dx * force;
        updatedParticle1.vy += dy * force;
        updatedParticle2.vx -= dx * force;
        updatedParticle2.vy -= dy * force;
      } 
      else if (particle1.charge === 'negative' && particle2.charge === 'negative') {
        // Minimal knowledge exchange
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.01;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.01;
        
        // Repulsion
        const force = interactionStrength * 0.1;
        updatedParticle1.vx -= dx * force;
        updatedParticle1.vy -= dy * force;
        updatedParticle2.vx += dx * force;
        updatedParticle2.vy += dy * force;
      }
      else if (particle1.charge === 'positive' && particle2.charge === 'negative') {
        // Moderate knowledge exchange
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.1;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.02;
        
        // Neutral effect
        const force = interactionStrength * 0.02;
        updatedParticle1.vx += dx * force;
        updatedParticle1.vy += dy * force;
        updatedParticle2.vx -= dx * force;
        updatedParticle2.vy -= dy * force;
      }
      else {
        // Other combinations (including neutral)
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.05;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.05;
        
        // Slight attraction
        const force = interactionStrength * 0.01;
        updatedParticle1.vx += dx * force;
        updatedParticle1.vy += dy * force;
        updatedParticle2.vx -= dx * force;
        updatedParticle2.vy -= dy * force;
      }
    }
    
    // Visual indication of interaction (color blending)
    const colorBlend = (color1: string, color2: string, amount: number): string => {
      // Simple RGBA color blending
      const match1 = color1.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      const match2 = color2.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      
      if (!match1 || !match2) return color1;
      
      const r1 = parseInt(match1[1]), g1 = parseInt(match1[2]), b1 = parseInt(match1[3]), a1 = parseFloat(match1[4]);
      const r2 = parseInt(match2[1]), g2 = parseInt(match2[2]), b2 = parseInt(match2[3]), a2 = parseFloat(match2[4]);
      
      const r = Math.round(r1 * (1 - amount) + r2 * amount);
      const g = Math.round(g1 * (1 - amount) + g2 * amount);
      const b = Math.round(b1 * (1 - amount) + b2 * amount);
      const a = a1 * (1 - amount) + a2 * amount;
      
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };
    
    const blendAmount = interactionStrength * 0.1;
    updatedParticle1.color = colorBlend(particle1.color, particle2.color, blendAmount);
    updatedParticle2.color = colorBlend(particle2.color, particle1.color, blendAmount);
    
    // Knowledge increases size slightly (with a cap)
    updatedParticle1.size = Math.min(10, particle1.size + particle1.knowledge * 0.0001);
    updatedParticle2.size = Math.min(10, particle2.size + particle2.knowledge * 0.0001);
  }
  
  return [updatedParticle1, updatedParticle2, interactionOccurred];
}
