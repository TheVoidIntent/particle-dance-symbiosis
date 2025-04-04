import { v4 as uuidv4 } from 'uuid';
import { Particle, ParticleType } from '@/types/simulation';

export interface AnomalyEvent {
  type: string;
  description: string;
  particles: string[];
  timestamp: number;
  severity: number;
  affectedParticles: number;
}

// Create a particle from intent field value
export function createParticleFromField(
  fieldValue: number,
  x: number,
  y: number,
  z: number,
  timestamp: number
): Particle {
  // Determine charge based on field value
  let charge: 'positive' | 'negative' | 'neutral';
  let color: string;
  let interactionTendency: number;
  
  if (fieldValue > 0.2) {
    // Positive fluctuation = positive charge
    charge = 'positive';
    color = 'rgba(239, 68, 68, 0.8)'; // Red
    interactionTendency = 0.7 + fieldValue * 0.3; // Higher tendency to interact
  } else if (fieldValue < -0.2) {
    // Negative fluctuation = negative charge
    charge = 'negative';
    color = 'rgba(147, 51, 234, 0.8)'; // Purple
    interactionTendency = 0.3 + Math.abs(fieldValue) * 0.2; // Lower tendency to interact
  } else {
    // Near-zero fluctuation = neutral charge
    charge = 'neutral';
    color = 'rgba(74, 222, 128, 0.8)'; // Green
    interactionTendency = 0.5; // Moderate tendency
  }
  
  // Determine particle type based on field intensity and randomness
  let type: 'regular' | 'high-energy' | 'quantum' | 'composite' | 'adaptive' = 'regular';
  
  if (Math.abs(fieldValue) > 0.8) {
    type = 'high-energy';
  } else if (Math.random() < 0.05) {
    type = Math.random() < 0.5 ? 'quantum' : 'composite';
  }
  
  // Calculate radius and size
  const radius = 3 + Math.random() * 2;
  const size = radius * 2; // Size is diameter
  
  // Create the particle with physics properties
  return {
    id: uuidv4(),
    x,
    y,
    z,
    vx: (Math.random() - 0.5) * 2, // Random initial velocity
    vy: (Math.random() - 0.5) * 2,
    vz: (Math.random() - 0.5) * 0.5,
    charge,
    radius,
    size, // Add the size property
    color,
    intent: fieldValue,
    interactionTendency,
    knowledge: 0.1 + Math.random() * 0.2, // Initial knowledge
    complexity: 1, // Initial complexity
    energy: 1 + Math.abs(fieldValue), // Energy based on field intensity
    type,
    age: 0,
    mass: 1, // Add required property
    scale: 1, // Add required property
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

// Update particle position based on forces and boundary conditions
export function updateParticlePosition(
  particle: Particle,
  dimensions: { width: number, height: number },
  intentField: number[][][],
  viewMode: '2d' | '3d' = '2d',
  nearbyParticles: Particle[] = []
): Particle {
  // Apply intent field influence if available
  let fieldInfluence = { x: 0, y: 0 };
  
  if (intentField && intentField.length > 0) {
    const fieldWidth = intentField[0][0].length;
    const fieldHeight = intentField[0].length;
    const fieldDepth = intentField.length;
    
    const fieldX = Math.floor(particle.x / (dimensions.width / fieldWidth));
    const fieldY = Math.floor(particle.y / (dimensions.height / fieldHeight));
    const fieldZ = Math.floor(particle.z / (10 / fieldDepth));
    
    // Get field value, handling out-of-bounds gracefully
    let fieldValue = 0;
    try {
      fieldValue = intentField[
        Math.min(Math.max(0, fieldZ), fieldDepth - 1)
      ][
        Math.min(Math.max(0, fieldY), fieldHeight - 1)
      ][
        Math.min(Math.max(0, fieldX), fieldWidth - 1)
      ];
    } catch (e) {
      // Handle any index errors
      console.error("Field access error:", e);
    }
    
    // Calculate field influence based on particle charge
    const intentFactor = 0.02;
    if (particle.charge === 'positive') {
      // Positive charges are attracted to positive intent
      fieldInfluence.x = fieldValue * intentFactor;
      fieldInfluence.y = fieldValue * intentFactor;
    } else if (particle.charge === 'negative') {
      // Negative charges are attracted to negative intent
      fieldInfluence.x = -fieldValue * intentFactor;
      fieldInfluence.y = -fieldValue * intentFactor;
    } else {
      // Neutral charges move more randomly
      fieldInfluence.x = (Math.random() - 0.5) * 0.02;
      fieldInfluence.y = (Math.random() - 0.5) * 0.02;
    }
  }
  
  // Update velocity with field influence
  let vx = particle.vx + fieldInfluence.x;
  let vy = particle.vy + fieldInfluence.y;
  let vz = particle.vz;
  
  // Apply damping/drag
  vx *= 0.98;
  vy *= 0.98;
  vz *= 0.98;
  
  // Calculate new position
  let x = particle.x + vx;
  let y = particle.y + vy;
  let z = particle.z + vz;
  
  // Handle boundary conditions
  // Wrap around boundaries
  if (x < 0) x = dimensions.width;
  if (x > dimensions.width) x = 0;
  if (y < 0) y = dimensions.height;
  if (y > dimensions.height) y = 0;
  
  // For z (if in 3D mode)
  if (viewMode === '3d') {
    if (z < 0) z = 10;
    if (z > 10) z = 0;
  } else {
    z = 0; // Force z=0 in 2D mode
  }
  
  // Update particle properties based on interactions and age
  let energy = Math.max(0, (particle.energy || 1) - (particle.intentDecayRate || 0.001));
  let knowledge = particle.knowledge || 0;
  let complexity = particle.complexity || 1;
  
  // Small chance to randomly gain knowledge
  if (Math.random() < 0.01) {
    knowledge += 0.001;
  }
  
  // Return updated particle
  return {
    ...particle,
    x,
    y,
    z,
    vx,
    vy,
    vz,
    energy,
    knowledge,
    complexity,
    age: (particle.age || 0) + 1
  };
}

// Calculate interaction between two particles
export function calculateParticleInteraction(
  p1: Particle,
  p2: Particle,
  learningRate: number = 0.1,
  viewMode: '2d' | '3d' = '2d'
): [Particle, Particle, boolean] {
  // Calculate distance
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = viewMode === '3d' ? p2.z - p1.z : 0;
  
  const distanceSquared = dx * dx + dy * dy + dz * dz;
  const interactionRadius = (p1.radius + p2.radius) + 5;
  
  // No interaction if too far apart
  if (distanceSquared > interactionRadius * interactionRadius) {
    return [p1, p2, false];
  }
  
  // Calculate interaction probability based on tendencies
  const interactionProbability = p1.interactionTendency * p2.interactionTendency * 0.2;
  
  // Randomly determine if interaction occurs
  if (Math.random() > interactionProbability) {
    return [p1, p2, false];
  }
  
  // Interaction occurs! Update particles
  
  // Knowledge exchange
  const p1Knowledge = p1.knowledge || 0;
  const p2Knowledge = p2.knowledge || 0;
  
  // More knowledgeable particle shares with less knowledgeable
  const knowledgeDiff = Math.abs(p1Knowledge - p2Knowledge);
  const transferAmount = knowledgeDiff * learningRate;
  
  let newP1Knowledge = p1Knowledge;
  let newP2Knowledge = p2Knowledge;
  
  if (p1Knowledge > p2Knowledge) {
    newP1Knowledge -= transferAmount * 0.5; // Lose some when teaching
    newP2Knowledge += transferAmount;
  } else {
    newP1Knowledge += transferAmount;
    newP2Knowledge -= transferAmount * 0.5;
  }
  
  // Apply repulsive force (simple physics)
  const distance = Math.sqrt(distanceSquared);
  const strength = 0.1; // Strength of the repulsion
  
  const forceX = dx / distance * strength;
  const forceY = dy / distance * strength;
  const forceZ = dz / distance * strength;
  
  // Create updated particles
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

// Analyze particles to detect clusters based on proximity and properties
export function analyzeParticleClusters(particles: Particle[], threshold: number = 0.7): {
  clusters: Particle[][],
  unclusteredParticles: Particle[]
} {
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  // Find clusters using a simple proximity algorithm
  for (const particle of particles) {
    if (visited.has(particle.id)) continue;
    
    const cluster: Particle[] = [particle];
    visited.add(particle.id);
    
    // Expand cluster
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      for (const other of particles) {
        if (visited.has(other.id)) continue;
        
        // Calculate distance
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distanceSquared = dx * dx + dy * dy;
        
        // Add to cluster if close enough and similar charge
        const maxDistance = (current.radius + other.radius) * 3;
        if (distanceSquared <= maxDistance * maxDistance && 
            other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id);
        }
      }
      
      i++;
    }
    
    // Only consider it a cluster if it has multiple particles
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  }
  
  // Find unclustered particles
  const unclusteredParticles = particles.filter(p => 
    !clusters.some(cluster => cluster.some(cp => cp.id === p.id))
  );
  
  return { clusters, unclusteredParticles };
}

// Calculate system entropy based on particle distribution
export function calculateSystemEntropy(particles: Particle[]): number {
  if (particles.length === 0) return 0;
  
  // Count particles by type
  const chargeCount = {
    positive: particles.filter(p => p.charge === 'positive').length,
    negative: particles.filter(p => p.charge === 'negative').length,
    neutral: particles.filter(p => p.charge === 'neutral').length
  };
  
  const total = particles.length;
  
  // Calculate entropy using Shannon formula
  let entropy = 0;
  for (const charge in chargeCount) {
    const probability = chargeCount[charge as keyof typeof chargeCount] / total;
    if (probability > 0) {
      entropy -= probability * Math.log2(probability);
    }
  }
  
  // Normalize to [0, 1]
  return entropy / Math.log2(3); // 3 is the number of charge types
}

// Add the missing function for anomaly detection
export function detectAnomalies(
  particles: Particle[],
  previousState: any,
  currentState: any,
  frameCount: number
): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];
  
  // Simple anomaly detection based on entropy changes
  if (previousState && currentState) {
    // Detect entropy spikes
    if (Math.abs(currentState.entropy - previousState.entropy) > 0.2) {
      anomalies.push({
        type: 'entropy_spike',
        description: `Significant change in system entropy detected at frame ${frameCount}`,
        particles: particles.slice(0, 5).map(p => p.id),
        timestamp: frameCount,
        severity: 0.7,
        affectedParticles: Math.floor(particles.length * 0.3)
      });
    }
    
    // Detect cluster formation
    if (currentState.clusterCount > previousState.clusterCount * 1.5) {
      anomalies.push({
        type: 'cluster_formation',
        description: `Rapid formation of particle clusters detected at frame ${frameCount}`,
        particles: particles.slice(0, 5).map(p => p.id),
        timestamp: frameCount,
        severity: 0.6,
        affectedParticles: Math.floor(particles.length * 0.2)
      });
    }
  }
  
  return anomalies;
}

// Add the missing function for creating a particle (used by useInflationHandler)
export function createParticle(
  x: number,
  y: number,
  z: number,
  charge: 'positive' | 'negative' | 'neutral',
  type: ParticleType,
  timestamp: number
): Particle {
  // Calculate radius and size
  const radius = 3 + Math.random() * 2;
  const size = radius * 2; // Size is diameter
  
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
    size, // Add the size property
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
