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

export function createParticleFromField(
  fieldValue: number,
  x: number,
  y: number,
  z: number,
  timestamp: number
): Particle {
  let charge: 'positive' | 'negative' | 'neutral';
  let color: string;
  let interactionTendency: number;
  
  if (fieldValue > 0.2) {
    charge = 'positive';
    color = 'rgba(239, 68, 68, 0.8)';
    interactionTendency = 0.7 + fieldValue * 0.3;
  } else if (fieldValue < -0.2) {
    charge = 'negative';
    color = 'rgba(147, 51, 234, 0.8)';
    interactionTendency = 0.3 + Math.abs(fieldValue) * 0.2;
  } else {
    charge = 'neutral';
    color = 'rgba(74, 222, 128, 0.8)';
    interactionTendency = 0.5;
  }
  
  let type: 'regular' | 'high-energy' | 'quantum' | 'composite' | 'adaptive' = 'regular';
  
  if (Math.abs(fieldValue) > 0.8) {
    type = 'high-energy';
  } else if (Math.random() < 0.05) {
    type = Math.random() < 0.5 ? 'quantum' : 'composite';
  }
  
  const radius = 3 + Math.random() * 2;
  const size = radius * 2;
  
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
    size,
    color,
    intent: fieldValue,
    interactionTendency,
    knowledge: 0.1 + Math.random() * 0.2,
    complexity: 1,
    energy: 1 + Math.abs(fieldValue),
    type,
    age: 0,
    mass: 1,
    scale: 1,
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

export function updateParticlePosition(
  particle: Particle,
  dimensions: { width: number, height: number },
  intentField: number[][][],
  viewMode: '2d' | '3d' = '2d',
  nearbyParticles: Particle[] = []
): Particle {
  let fieldInfluence = { x: 0, y: 0 };
  
  if (intentField && intentField.length > 0) {
    const fieldWidth = intentField[0][0].length;
    const fieldHeight = intentField[0].length;
    const fieldDepth = intentField.length;
    
    const fieldX = Math.floor(particle.x / (dimensions.width / fieldWidth));
    const fieldY = Math.floor(particle.y / (dimensions.height / fieldHeight));
    const fieldZ = Math.floor(particle.z / (10 / fieldDepth));
    
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
      console.error("Field access error:", e);
    }
    
    const intentFactor = 0.02;
    if (particle.charge === 'positive') {
      fieldInfluence.x = fieldValue * intentFactor;
      fieldInfluence.y = fieldValue * intentFactor;
    } else if (particle.charge === 'negative') {
      fieldInfluence.x = -fieldValue * intentFactor;
      fieldInfluence.y = -fieldValue * intentFactor;
    } else {
      fieldInfluence.x = (Math.random() - 0.5) * 0.02;
      fieldInfluence.y = (Math.random() - 0.5) * 0.02;
    }
  }
  
  let vx = particle.vx + fieldInfluence.x;
  let vy = particle.vy + fieldInfluence.y;
  let vz = particle.vz;
  
  vx *= 0.98;
  vy *= 0.98;
  vz *= 0.98;
  
  let x = particle.x + vx;
  let y = particle.y + vy;
  let z = particle.z + vz;
  
  if (x < 0) x = dimensions.width;
  if (x > dimensions.width) x = 0;
  if (y < 0) y = dimensions.height;
  if (y > dimensions.height) y = 0;
  
  if (viewMode === '3d') {
    if (z < 0) z = 10;
    if (z > 10) z = 0;
  } else {
    z = 0;
  }
  
  let energy = Math.max(0, (particle.energy || 1) - (particle.intentDecayRate || 0.001));
  let knowledge = particle.knowledge || 0;
  let complexity = particle.complexity || 1;
  
  if (Math.random() < 0.01) {
    knowledge += 0.001;
  }
  
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

export function analyzeParticleClusters(particles: Particle[], threshold: number = 0.7): {
  clusters: Particle[][],
  unclusteredParticles: Particle[]
} {
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  for (const particle of particles) {
    if (visited.has(particle.id)) continue;
    
    const cluster: Particle[] = [particle];
    visited.add(particle.id);
    
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      for (const other of particles) {
        if (visited.has(other.id)) continue;
        
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared <= (current.radius + other.radius) * 3 * (threshold || 1) && 
            other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id);
        }
      }
      
      i++;
    }
    
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  }
  
  const unclusteredParticles = particles.filter(p => 
    !clusters.some(cluster => cluster.some(cp => cp.id === p.id))
  );
  
  return { clusters, unclusteredParticles };
}

export function calculateSystemEntropy(particles: Particle[]): number {
  if (particles.length === 0) return 0;
  
  const chargeCount = {
    positive: particles.filter(p => p.charge === 'positive').length,
    negative: particles.filter(p => p.charge === 'negative').length,
    neutral: particles.filter(p => p.charge === 'neutral').length
  };
  
  const total = particles.length;
  
  let entropy = 0;
  for (const charge in chargeCount) {
    const probability = chargeCount[charge as keyof typeof chargeCount] / total;
    if (probability > 0) {
      entropy -= probability * Math.log2(probability);
    }
  }
  
  return entropy / Math.log2(3);
}

export function detectAnomalies(
  particles: Particle[],
  previousState: any,
  currentState: any,
  frameCount: number
): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];
  
  if (previousState && currentState) {
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

export function createParticle(
  x: number,
  y: number,
  z: number,
  charge: 'positive' | 'negative' | 'neutral',
  type: ParticleType,
  timestamp: number
): Particle {
  const radius = 3 + Math.random() * 2;
  const size = radius * 2;
  
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
    size,
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
