// Define the extended particle types and interfaces
export type ParticleType = 'standard' | 'high-energy' | 'quantum' | 'composite' | 'adaptive';
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
  complexity: number;
  connections: number;
  interactionMemory: Map<number, number>;
  intentEntropy: number;
  clusterAffiliation: number;
  phase: number;
  adaptiveScore: number;
  age: number;
  energyCapacity: number;
  intentDecayRate: number;
}

// Create a new particle based on an intent field value
export function createParticleFromField(
  fieldValue: number,
  x: number,
  y: number,
  z: number,
  id: number
): Particle {
  let charge: ParticleCharge;
  let color: string;
  let type: ParticleType = 'standard';
  let energy = Math.random();
  let stability = Math.random() * 0.8 + 0.2;
  
  if (fieldValue > 0.3) {
    charge = 'positive';
    color = 'rgba(52, 211, 153, 0.8)';
  } else if (fieldValue < -0.3) {
    charge = 'negative';
    color = 'rgba(248, 113, 113, 0.8)';
  } else {
    charge = 'neutral';
    color = 'rgba(209, 213, 219, 0.8)';
  }
  
  const typeRandom = Math.random();
  if (typeRandom > 0.95) {
    type = 'high-energy';
    energy = 0.8 + Math.random() * 0.2;
    color = 'rgba(250, 204, 21, 0.85)';
    stability = 0.4 + Math.random() * 0.3;
  } else if (typeRandom > 0.90) {
    type = 'quantum';
    color = 'rgba(168, 85, 247, 0.85)';
    energy = 0.6 + Math.random() * 0.3;
    stability = 0.1 + Math.random() * 0.3;
  }
  
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
    stability,
    complexity: 1,
    connections: 0,
    interactionMemory: new Map<number, number>(),
    intentEntropy: Math.random(),
    clusterAffiliation: -1,
    phase: Math.random() * Math.PI * 2,
    adaptiveScore: 0,
    age: 0,
    energyCapacity: 1 + Math.random() * 0.5,
    intentDecayRate: 0.0001 + (Math.random() * 0.0001)
  };
}

// Update a particle's position based on its properties
export function updateParticlePosition(
  particle: Particle,
  dimensions: { width: number; height: number },
  intentField: number[][][],
  viewMode: '2d' | '3d',
  particleSystem?: Particle[]
): Particle {
  const updatedParticle = { ...particle };
  
  updatedParticle.age += 1;
  
  const intentDecay = updatedParticle.intentDecayRate * (1 - updatedParticle.knowledge * 0.1);
  updatedParticle.intent *= (1 - intentDecay);
  
  updatedParticle.x += updatedParticle.vx;
  updatedParticle.y += updatedParticle.vy;
  updatedParticle.z += viewMode === '3d' ? updatedParticle.vz : 0;
  
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
    
    if (updatedParticle.type === 'standard') {
      const influence = fieldValue * 0.01;
      updatedParticle.vx += influence * (Math.random() - 0.5);
      updatedParticle.vy += influence * (Math.random() - 0.5);
      if (viewMode === '3d') {
        updatedParticle.vz += influence * (Math.random() - 0.5) * 0.5;
      }
    } else if (updatedParticle.type === 'high-energy') {
      const influence = fieldValue * 0.005;
      updatedParticle.vx += influence * (Math.random() - 0.5) + (Math.random() - 0.5) * 0.05;
      updatedParticle.vy += influence * (Math.random() - 0.5) + (Math.random() - 0.5) * 0.05;
      if (viewMode === '3d') {
        updatedParticle.vz += influence * (Math.random() - 0.5) * 0.5 + (Math.random() - 0.5) * 0.05;
      }
    } else if (updatedParticle.type === 'quantum') {
      if (Math.random() > 0.98) {
        const teleportDistance = 20 * Math.random();
        const angle = Math.random() * Math.PI * 2;
        
        updatedParticle.x += Math.cos(angle) * teleportDistance;
        updatedParticle.y += Math.sin(angle) * teleportDistance;
        
        updatedParticle.x = Math.max(0, Math.min(dimensions.width, updatedParticle.x));
        updatedParticle.y = Math.max(0, Math.min(dimensions.height, updatedParticle.y));
      }
      
      updatedParticle.vx += (Math.random() - 0.5) * 0.2;
      updatedParticle.vy += (Math.random() - 0.5) * 0.2;
      if (viewMode === '3d') {
        updatedParticle.vz += (Math.random() - 0.5) * 0.2;
      }
    } else if (updatedParticle.type === 'adaptive') {
      const adaptiveFactor = 0.02 * (1 + updatedParticle.adaptiveScore / 10);
      
      if (updatedParticle.interactionMemory.size > 0 && particleSystem) {
        let strongestPartnerID = -1;
        let strongestInteraction = 0;
        
        updatedParticle.interactionMemory.forEach((strength, partnerID) => {
          if (particleSystem.some(p => p.id === partnerID) && strength > strongestInteraction) {
            strongestPartnerID = partnerID;
            strongestInteraction = strength;
          }
        });
        
        if (strongestPartnerID !== -1) {
          const partner = particleSystem.find(p => p.id === strongestPartnerID);
          if (partner) {
            const partnerDx = partner.x - updatedParticle.x;
            const partnerDy = partner.y - updatedParticle.y;
            const partnerDistance = Math.sqrt(partnerDx * partnerDx + partnerDy * partnerDy);
            
            if (partnerDistance > 50) {
              updatedParticle.vx += (partnerDx / partnerDistance) * adaptiveFactor;
              updatedParticle.vy += (partnerDy / partnerDistance) * adaptiveFactor;
            }
          }
        }
      }
      
      updatedParticle.vx += fieldValue * adaptiveFactor * (Math.random() - 0.3);
      updatedParticle.vy += fieldValue * adaptiveFactor * (Math.random() - 0.3);
    } else if (updatedParticle.type === 'composite') {
      const complexityFactor = Math.min(0.1, updatedParticle.complexity * 0.01);
      
      if (updatedParticle.complexity > 5) {
        let bestDirection = { x: 0, y: 0, value: fieldValue };
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          const sampleDist = 30;
          const sampleX = updatedParticle.x + Math.cos(angle) * sampleDist;
          const sampleY = updatedParticle.y + Math.sin(angle) * sampleDist;
          
          if (sampleX >= 0 && sampleX < dimensions.width && sampleY >= 0 && sampleY < dimensions.height) {
            const sampleFieldX = Math.floor(sampleX / (dimensions.width / intentField[0][0].length));
            const sampleFieldY = Math.floor(sampleY / (dimensions.height / intentField[0].length));
            
            const sampleValue = intentField[
              Math.min(fieldZ, intentField.length - 1)
            ][
              Math.min(sampleFieldY, intentField[0].length - 1)
            ][
              Math.min(sampleFieldX, intentField[0][0].length - 1)
            ];
            
            if ((updatedParticle.charge === 'positive' && sampleValue > bestDirection.value) ||
                (updatedParticle.charge === 'negative' && sampleValue < bestDirection.value) ||
                (updatedParticle.charge === 'neutral' && Math.abs(sampleValue) < Math.abs(bestDirection.value))) {
              bestDirection = { x: sampleX, y: sampleY, value: sampleValue };
            }
          }
        }
        
        if (bestDirection.x !== 0 || bestDirection.y !== 0) {
          const dirX = bestDirection.x - updatedParticle.x;
          const dirY = bestDirection.y - updatedParticle.y;
          const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
          
          if (dirLength > 0) {
            updatedParticle.vx += (dirX / dirLength) * complexityFactor;
            updatedParticle.vy += (dirY / dirLength) * complexityFactor;
          }
        }
      }
    }
    
    updatedParticle.energy *= (0.9999 + updatedParticle.stability * 0.0001);
    updatedParticle.energy = Math.min(updatedParticle.energyCapacity, updatedParticle.energy);
    
    updatedParticle.intentEntropy = Math.max(0, Math.min(1, 
      updatedParticle.intentEntropy * (1 - 0.01) + 
      Math.abs(fieldValue - updatedParticle.intent) * 0.05
    ));
    
    const memoryEffect = updatedParticle.knowledge * 0.05;
    updatedParticle.vx *= (1 + memoryEffect);
    updatedParticle.vy *= (1 + memoryEffect);
    
    if (updatedParticle.vx > 10) updatedParticle.vx = 10;
    if (updatedParticle.vy > 10) updatedParticle.vy = 10;
    if (updatedParticle.vz > 10) updatedParticle.vz = 10;
    if (updatedParticle.vx < -10) updatedParticle.vx = -10;
    if (updatedParticle.vy < -10) updatedParticle.vy = -10;
    if (updatedParticle.vz < -10) updatedParticle.vz = -10;
  } catch (error) {
    console.log("Field access error", error);
  }
  
  return updatedParticle;
}

// Try to form a composite particle from two interacting particles
function tryFormCompositeParticle(
  particle1: Particle,
  particle2: Particle,
  interactionStrength: number
): [Particle, Particle, boolean] {
  const updatedParticle1 = { ...particle1 };
  const updatedParticle2 = { ...particle2 };
  
  const oppositeCharges = 
    (particle1.charge === 'positive' && (particle2.charge === 'negative' || particle2.charge === 'neutral')) ||
    (particle2.charge === 'positive' && (particle1.charge === 'negative' || particle1.charge === 'neutral'));
  
  const sufficientKnowledge = 
    particle1.knowledge > 1 && 
    particle2.knowledge > 1;
  
  const sufficientEnergy = 
    particle1.energy > 0.4 && 
    particle2.energy > 0.4;
    
  const chanceToForm = Math.random();
  
  const entropyFactor = (2 - particle1.intentEntropy - particle2.intentEntropy) / 2;
  const ageFactor = Math.min(1, (particle1.age + particle2.age) / 200);
  
  const formationThreshold = 0.6 * entropyFactor * ageFactor;
  
  if (oppositeCharges && sufficientKnowledge && sufficientEnergy && chanceToForm < formationThreshold) {
    if (Math.random() > 0.5) {
      updatedParticle1.type = 'composite';
      updatedParticle1.complexity = particle1.complexity + particle2.complexity;
      updatedParticle1.connections += 1;
      updatedParticle1.knowledge += particle2.knowledge * 0.5;
      updatedParticle1.energy = (particle1.energy + particle2.energy) * 0.8;
      
      particle2.interactionMemory.forEach((strength, id) => {
        if (id !== updatedParticle1.id) {
          const existingStrength = updatedParticle1.interactionMemory.get(id) || 0;
          updatedParticle1.interactionMemory.set(id, existingStrength + strength * 0.5);
        }
      });
      
      updatedParticle1.intentEntropy = (particle1.intentEntropy + particle2.intentEntropy) * 0.4;
      updatedParticle1.energyCapacity += particle2.energyCapacity * 0.5;
      
      updatedParticle1.size = Math.min(15, particle1.size * 1.2);
      updatedParticle1.color = 'rgba(66, 153, 225, 0.85)';
      
      updatedParticle2.energy *= 0.3;
      updatedParticle2.knowledge *= 0.3;
      updatedParticle2.size *= 0.7;
      
      return [updatedParticle1, updatedParticle2, true];
    } else {
      updatedParticle2.type = 'composite';
      updatedParticle2.complexity = particle1.complexity + particle2.complexity;
      updatedParticle2.connections += 1;
      updatedParticle2.knowledge += particle1.knowledge * 0.5;
      updatedParticle2.energy = (particle1.energy + particle2.energy) * 0.8;
      
      updatedParticle2.size = Math.min(15, particle2.size * 1.2);
      updatedParticle2.color = 'rgba(66, 153, 225, 0.85)';
      
      updatedParticle1.energy *= 0.3;
      updatedParticle1.knowledge *= 0.3;
      updatedParticle1.size *= 0.7;
      
      return [updatedParticle1, updatedParticle2, true];
    }
  }
  
  return [updatedParticle1, updatedParticle2, false];
}

// Helper function to blend colors
function blendColors(color1: string, color2: string, ratio: number): string {
  const match1 = color1.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  const match2 = color2.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  
  if (!match1 || !match2) return color1;
  
  const r1 = parseInt(match1[1]), g1 = parseInt(match1[2]), b1 = parseInt(match1[3]), a1 = parseFloat(match1[4]);
  const r2 = parseInt(match2[1]), g2 = parseInt(match2[2]), b2 = parseInt(match2[3]), a2 = parseFloat(match2[4]);
  
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  const a = a1 * (1 - ratio) + a2 * ratio;
  
  return `rgba(${r}, ${g}, ${b}, ${a})`;
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
  
  const dx = particle2.x - particle1.x;
  const dy = particle2.y - particle1.y;
  const dz = viewMode === '3d' ? particle2.z - particle1.z : 0;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  const baseInteractionRange = (particle1.size + particle2.size) * 4;
  
  const complexityFactor1 = 1 + (particle1.complexity - 1) * 0.1;
  const complexityFactor2 = 1 + (particle2.complexity - 1) * 0.1;
  
  const energyFactor1 = particle1.type === 'high-energy' ? 1.5 : 1;
  const energyFactor2 = particle2.type === 'high-energy' ? 1.5 : 1;
  
  const quantumFactor1 = particle1.type === 'quantum' ? (0.5 + Math.random()) : 1;
  const quantumFactor2 = particle2.type === 'quantum' ? (0.5 + Math.random()) : 1;
  
  const compositeFactor1 = particle1.type === 'composite' ? 1.5 + particle1.complexity * 0.1 : 1;
  const compositeFactor2 = particle2.type === 'composite' ? 1.5 + particle2.complexity * 0.1 : 1;
  
  const interactionRange = baseInteractionRange * energyFactor1 * energyFactor2 * 
                          quantumFactor1 * quantumFactor2 * 
                          complexityFactor1 * complexityFactor2 *
                          compositeFactor1 * compositeFactor2;
  
  if (distance < interactionRange) {
    interactionOccurred = true;
    
    const interactionStrength = learningRate / (distance + 0.1);
    
    const [compositeParticle1, compositeParticle2, compositeFormed] = 
      tryFormCompositeParticle(particle1, particle2, interactionStrength);
    
    if (compositeFormed) {
      return [compositeParticle1, compositeParticle2, true];
    }
    
    const intentSimilarity = 1 - Math.abs(particle1.intent - particle2.intent);
    const knowledgeTransferMultiplier = 0.2 + intentSimilarity * 0.3;
    
    if (particle1.type === 'composite' || particle2.type === 'composite') {
      const compositeParticle = particle1.type === 'composite' ? particle1 : particle2;
      const regularParticle = particle1.type === 'composite' ? particle2 : particle1;
      
      const compositeKnowledgeBoost = Math.min(0.5, compositeParticle.complexity * 0.05);
      
      if (particle1.type === 'composite') {
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 
                                      knowledgeTransferMultiplier * (1 + compositeKnowledgeBoost);
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 
                                      knowledgeTransferMultiplier * 0.3;
        
        updatedParticle1.connections += 0.1;
        
        const gravitationalPull = interactionStrength * 0.02 * updatedParticle1.complexity;
        updatedParticle2.vx += dx * gravitationalPull;
        updatedParticle2.vy += dy * gravitationalPull;
      } else {
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 
                                      knowledgeTransferMultiplier * (1 + compositeKnowledgeBoost);
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 
                                      knowledgeTransferMultiplier * 0.3;
        
        updatedParticle2.connections += 0.1;
        
        const gravitationalPull = interactionStrength * 0.02 * updatedParticle2.complexity;
        updatedParticle1.vx += dx * gravitationalPull;
        updatedParticle1.vy += dy * gravitationalPull;
      }
    } else if (particle1.type === 'quantum' || particle2.type === 'quantum') {
      const quantumEffect = Math.random() * 2 - 1;
      
      if (quantumEffect > 0.7) {
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.4;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.4;
        
        const energyTransfer = (particle2.energy - particle1.energy) * 0.1;
        updatedParticle1.energy += energyTransfer;
        updatedParticle2.energy -= energyTransfer;
      } else if (quantumEffect < -0.7) {
        const force = interactionStrength * 0.2;
        updatedParticle1.vx -= dx * force;
        updatedParticle1.vy -= dy * force;
        updatedParticle2.vx += dx * force;
        updatedParticle2.vy += dy * force;
      }
    } else if (particle1.type === 'high-energy' || particle2.type === 'high-energy') {
      const energyBoost = particle1.type === 'high-energy' ? particle1.energy : particle2.energy;
      
      updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.3 * energyBoost;
      updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.3 * energyBoost;
      
      const force = interactionStrength * 0.03 * energyBoost;
      updatedParticle1.vx += dx * force;
      updatedParticle1.vy += dy * force;
      updatedParticle2.vx -= dx * force;
      updatedParticle2.vy -= dy * force;
      
      if (Math.random() > 0.8) {
        updatedParticle1.complexity += 0.1;
        updatedParticle2.complexity += 0.1;
      }
    } else {
      if (particle1.charge === 'positive' && particle2.charge === 'positive') {
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.2;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.2;
        
        const force = interactionStrength * 0.05;
        updatedParticle1.vx += dx * force;
        updatedParticle1.vy += dy * force;
        updatedParticle2.vx -= dx * force;
        updatedParticle2.vy -= dy * force;
      } else if (particle1.charge === 'negative' && particle2.charge === 'negative') {
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.01;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.01;
        
        const force = interactionStrength * 0.1;
        updatedParticle1.vx -= dx * force;
        updatedParticle1.vy -= dy * force;
        updatedParticle2.vx += dx * force;
        updatedParticle2.vy += dy * force;
      } else if (particle1.charge === 'positive' && particle2.charge === 'negative') {
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.1;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.02;
        
        const force = interactionStrength * 0.02;
        updatedParticle1.vx += dx * force;
        updatedParticle1.vy += dy * force;
        updatedParticle2.vx -= dx * force;
        updatedParticle2.vy -= dy * force;
      } else {
        updatedParticle1.knowledge += particle2.knowledge * interactionStrength * 0.05;
        updatedParticle2.knowledge += particle1.knowledge * interactionStrength * 0.05;
        
        const force = interactionStrength * 0.01;
        updatedParticle1.vx += dx * force;
        updatedParticle1.vy += dy * force;
        updatedParticle2.vx -= dx * force;
        updatedParticle2.vy -= dy * force;
      }
    }
    
    updatedParticle1.connections += 0.01;
    updatedParticle2.connections += 0.01;
    
    const colorBlend = blendColors;
    
    const blendAmount = interactionStrength * 0.1;
    updatedParticle1.color = colorBlend(particle1.color, particle2.color, blendAmount);
    updatedParticle2.color = colorBlend(particle2.color, particle1.color, blendAmount);
    
    updatedParticle1.size = Math.min(10, particle1.size + particle1.knowledge * 0.0001);
    updatedParticle2.size = Math.min(10, particle2.size + particle2.knowledge * 0.0001);
    
    if (updatedParticle1.complexity > 2) {
      updatedParticle1.size = Math.min(15, updatedParticle1.size * (1 + (updatedParticle1.complexity - 2) * 0.02));
    }
    if (updatedParticle2.complexity > 2) {
      updatedParticle2.size = Math.min(15, updatedParticle2.size * (1 + (updatedParticle2.complexity - 2) * 0.02));
    }
  }
  
  return [updatedParticle1, updatedParticle2, interactionOccurred];
}

// Detect and analyze stable clusters
export function analyzeParticleClusters(particles: Particle[]): {
  clusterCount: number;
  averageClusterSize: number;
  largestClusterSize: number;
  clusterStability: number;
} {
  const clusterIds = new Set<number>();
  particles.forEach(p => {
    if (p.clusterAffiliation !== -1) {
      clusterIds.add(p.clusterAffiliation);
    }
  });
  
  const clusterSizes = new Map<number, number>();
  clusterIds.forEach(id => {
    const size = particles.filter(p => p.clusterAffiliation === id).length;
    clusterSizes.set(id, size);
  });
  
  const clusterCount = clusterIds.size;
  
  let totalSize = 0;
  let largestSize = 0;
  
  clusterSizes.forEach(size => {
    totalSize += size;
    largestSize = Math.max(largestSize, size);
  });
  
  const averageClusterSize = clusterCount > 0 ? totalSize / clusterCount : 0;
  
  let totalKnowledge = 0;
  let totalComplexity = 0;
  let totalAge = 0;
  let totalClusteredParticles = 0;
  
  clusterIds.forEach(id => {
    const clusterParticles = particles.filter(p => p.clusterAffiliation === id);
    totalClusteredParticles += clusterParticles.length;
    
    clusterParticles.forEach(p => {
      totalKnowledge += p.knowledge;
      totalComplexity += p.complexity;
      totalAge += p.age;
    });
  });
  
  const avgKnowledge = totalClusteredParticles > 0 ? totalKnowledge / totalClusteredParticles : 0;
  const avgComplexity = totalClusteredParticles > 0 ? totalComplexity / totalClusteredParticles : 0;
  const avgAge = totalClusteredParticles > 0 ? totalAge / totalClusteredParticles : 0;
  
  const knowledgeFactor = Math.min(1, avgKnowledge / 10);
  const complexityFactor = Math.min(1, avgComplexity / 5);
  const ageFactor = Math.min(1, avgAge / 500);
  
  const clusterStability = (knowledgeFactor * 0.4 + complexityFactor * 0.4 + ageFactor * 0.2);
  
  return {
    clusterCount,
    averageClusterSize,
    largestClusterSize,
    clusterStability
  };
}

// Calculate system-wide entropy
export function calculateSystemEntropy(particles: Particle[], intentField: number[][][]): number {
  let fieldEntropy = 0;
  let totalFieldValues = 0;
  
  intentField.forEach(plane => {
    plane.forEach(row => {
      row.forEach(value => {
        const normalizedValue = (value + 1) / 2;
        if (normalizedValue > 0 && normalizedValue < 1) {
          fieldEntropy -= normalizedValue * Math.log2(normalizedValue) + 
                          (1 - normalizedValue) * Math.log2(1 - normalizedValue);
        }
        totalFieldValues++;
      });
    });
  });
  
  const normalizedFieldEntropy = totalFieldValues > 0 ? fieldEntropy / totalFieldValues / 1 : 0;
  
  const particleTypes = ['standard', 'high-energy', 'quantum', 'composite', 'adaptive'];
  const particleCharges = ['positive', 'negative', 'neutral'];
  
  let typeDistribution = new Map<string, number>();
  let chargeDistribution = new Map<string, number>();
  
  particleTypes.forEach(type => typeDistribution.set(type, 0));
  particleCharges.forEach(charge => chargeDistribution.set(charge, 0));
  
  particles.forEach(p => {
    typeDistribution.set(p.type, (typeDistribution.get(p.type) || 0) + 1);
    chargeDistribution.set(p.charge, (chargeDistribution.get(p.charge) || 0) + 1);
  });
  
  let typeEntropy = 0;
  let chargeEntropy = 0;
  
  typeDistribution.forEach((count, type) => {
    const probability = count / particles.length;
    if (probability > 0) {
      typeEntropy -= probability * Math.log2(probability);
    }
  });
  
  chargeDistribution.forEach((count, charge) => {
    const probability = count / particles.length;
    if (probability > 0) {
      chargeEntropy -= probability * Math.log2(probability);
    }
  });
  
  const normalizedTypeEntropy = typeEntropy / Math.log2(particleTypes.length);
  const normalizedChargeEntropy = chargeEntropy / Math.log2(particleCharges.length);
  
  const systemEntropy = 
    normalizedFieldEntropy * 0.3 + 
    normalizedTypeEntropy * 0.35 + 
    normalizedChargeEntropy * 0.35;
  
  return systemEntropy;
}

// Record an anomaly event in the simulation
export interface AnomalyEvent {
  timestamp: number;
  type: 'phase_transition' | 'cluster_formation' | 'cluster_dissolution' | 'adaptive_emergence' | 'entropy_spike';
  description: string;
  affectedParticles: number;
  severity: number;
}

export function detectAnomalies(
  particles: Particle[], 
  previousState: {
    entropy: number,
    clusterCount: number,
    adaptiveCount: number,
    compositeCount: number,
  },
  currentState: {
    entropy: number,
    clusterCount: number,
    adaptiveCount: number,
    compositeCount: number,
  },
  timestamp: number
): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];
  
  const entropyChange = Math.abs(currentState.entropy - previousState.entropy);
  if (entropyChange > 0.15) {
    anomalies.push({
      timestamp,
      type: 'entropy_spike',
      description: currentState.entropy > previousState.entropy 
        ? 'Sudden increase in system entropy (more disorder)' 
        : 'Sudden decrease in system entropy (more order)',
      affectedParticles: particles.length,
      severity: Math.min(1, entropyChange * 2)
    });
  }
  
  const clusterChange = currentState.clusterCount - previousState.clusterCount;
  if (Math.abs(clusterChange) > 2) {
    anomalies.push({
      timestamp,
      type: clusterChange > 0 ? 'cluster_formation' : 'cluster_dissolution',
      description: clusterChange > 0 
        ? `Rapid formation of ${clusterChange} new clusters` 
        : `Dissolution of ${Math.abs(clusterChange)} existing clusters`,
      affectedParticles: Math.round(particles.length * 0.2),
      severity: Math.min(1, Math.abs(clusterChange) / 5)
    });
  }
  
  const adaptiveChange = currentState.adaptiveCount - previousState.adaptiveCount;
  if (adaptiveChange > 3) {
    anomalies.push({
      timestamp,
      type: 'adaptive_emergence',
      description: `Emergence of ${adaptiveChange} new adaptive particles`,
      affectedParticles: adaptiveChange,
      severity: Math.min(1, adaptiveChange / 10)
    });
  }
  
  const compositeChange = currentState.compositeCount - previousState.compositeCount;
  if (compositeChange > 5 || (previousState.compositeCount > 0 && compositeChange < -5)) {
    anomalies.push({
      timestamp,
      type: 'phase_transition',
      description: compositeChange > 0 
        ? `Rapid composition formation: ${compositeChange} new composite particles` 
        : `Major composition breakdown: ${Math.abs(compositeChange)} composite particles lost`,
      affectedParticles: Math.abs(compositeChange),
      severity: Math.min(1, Math.abs(compositeChange) / 10)
    });
  }
  
  return anomalies;
}
