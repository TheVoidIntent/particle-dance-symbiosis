export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  mass: number;
  charge: 'positive' | 'negative' | 'neutral';
  color: string;
  type: 'standard' | 'high-energy' | 'quantum' | 'composite' | 'adaptive';
  intent: number;
  intentDecayRate: number;
  knowledge: number;
  complexity: number;
  energy: number;
  energyCapacity: number;
  lastInteraction: number;
  interactionCount: number;
  adaptiveScore?: number;
  isPostInflation?: boolean;
  scale?: number;
}

export interface AnomalyEvent {
  timestamp: number;
  type: string;
  description: string;
  severity: number;
  affectedParticles: number;
}

export function createParticleFromField(
  fieldValue: number, 
  x: number, 
  y: number, 
  z: number,
  id: number
): Particle {
  const chargeType = fieldValue > 0.5 ? 'positive' : fieldValue < -0.5 ? 'negative' : 'neutral';
  const baseColor = chargeType === 'positive' ? 'rgba(239, 68, 68, 0.8)' : 
                    chargeType === 'negative' ? 'rgba(147, 51, 234, 0.8)' : 
                    'rgba(74, 222, 128, 0.8)';
  
  return {
    id: id,
    x: x,
    y: y,
    z: z,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    vz: (Math.random() - 0.5) * 2,
    radius: 5 + Math.random() * 3,
    mass: 1 + Math.random() * 2,
    charge: chargeType,
    color: baseColor,
    type: 'standard',
    intent: fieldValue,
    intentDecayRate: 0.0001,
    knowledge: Math.random(),
    complexity: Math.random() * 5,
    energy: 1 + Math.random() * 0.5,
    energyCapacity: 100,
    lastInteraction: 0,
    interactionCount: 0
  };
}

export function calculateParticleInteraction(
  particle1: Particle,
  particle2: Particle,
  learningRate: number,
  viewMode: '2d' | '3d'
): [Particle, Particle, boolean] {
  let interactionOccurred = false;
  
  // Calculate distance between particles
  const dx = particle2.x - particle1.x;
  const dy = particle2.y - particle1.y;
  const dz = particle2.z - particle1.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Define interaction radius
  const interactionRadius = particle1.radius + particle2.radius + 5;
  
  if (distance < interactionRadius) {
    interactionOccurred = true;
    
    // Adjust intent based on charges
    if (particle1.charge === particle2.charge) {
      // Particles with same charge repel each other
      const intentChange = learningRate * 0.01;
      particle1.intent -= intentChange;
      particle2.intent -= intentChange;
    } else {
      // Particles with opposite charge attract each other
      const intentChange = learningRate * 0.01;
      particle1.intent += intentChange;
      particle2.intent += intentChange;
    }
    
    // Exchange knowledge (simplified)
    const knowledgeExchangeRate = learningRate * 0.005;
    const knowledgeTransfer = (particle2.knowledge - particle1.knowledge) * knowledgeExchangeRate;
    particle1.knowledge += knowledgeTransfer;
    particle2.knowledge -= knowledgeTransfer;
    
    // Update last interaction timestamps
    particle1.lastInteraction = Date.now();
    particle2.lastInteraction = Date.now();
    
    // Increment interaction counts
    particle1.interactionCount++;
    particle2.interactionCount++;
    
    // Energy exchange (simplified)
    const energyExchangeRate = learningRate * 0.001;
    const energyTransfer = (particle2.energy - particle1.energy) * energyExchangeRate;
    particle1.energy += energyTransfer;
    particle2.energy -= energyTransfer;
  }
  
  return [particle1, particle2, interactionOccurred];
}

export function updateParticlePosition(
  particle: Particle,
  dimensions: { width: number; height: number },
  intentField: number[][][],
  viewMode: '2d' | '3d',
  allParticles: Particle[]
): Particle {
  // Get the intent field value at this location (with boundary checks)
  const fieldX = Math.floor(particle.x / (dimensions.width / intentField[0][0].length));
  const fieldY = Math.floor(particle.y / (dimensions.height / intentField[0].length));
  const fieldZ = Math.floor(particle.z / (10 / intentField.length));
  
  const fieldValue = intentField[
    Math.min(fieldZ, intentField.length - 1)
  ][
    Math.min(fieldY, intentField[0].length - 1)
  ][
    Math.min(fieldX, intentField[0][0].length - 1)
  ];
  
  // Influence velocity based on intent field
  particle.vx += fieldValue * 0.1;
  particle.vy += fieldValue * 0.1;
  particle.vz += fieldValue * 0.1;
  
  // Apply damping to velocity
  particle.vx *= 0.95;
  particle.vy *= 0.95;
  particle.vz *= 0.95;
  
  // Update position
  let newX = particle.x + particle.vx;
  let newY = particle.y + particle.vy;
  let newZ = particle.z + particle.vz;
  
  // Boundary checks
  const boundedX = Math.max(0, Math.min(dimensions.width, newX));
  const boundedY = Math.max(0, Math.min(dimensions.height, newY));
  const boundedZ = Math.max(0, Math.min(9.99, newZ));
  
  // Update velocity based on bounds
  particle.vx = boundedX !== newX ? -particle.vx * 0.8 : particle.vx;
  particle.vy = boundedY !== newY ? -particle.vy * 0.8 : particle.vy;
  particle.vz = boundedZ !== newZ ? -particle.vz * 0.8 : particle.vz;
  
  particle.x = boundedX;
  particle.y = boundedY;
  particle.z = boundedZ;
  
  // Apply intent decay if energy conservation is on
  particle.intent = Math.max(0, particle.intent - particle.intentDecayRate);
  
  // Drain energy every tick
  particle.energy = Math.max(0, particle.energy - 0.001);
  
  return particle;
}

export function detectAnomalies(
  particles: Particle[],
  previousState: any,
  currentState: any,
  frameCount: number
): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];
  
  // Example anomaly detection logic (can be expanded)
  if (particles.length > 150 && frameCount > 600) {
    anomalies.push({
      timestamp: Date.now(),
      type: 'particle_population_surge',
      description: 'Sudden increase in particle population detected.',
      severity: 0.7,
      affectedParticles: particles.length
    });
  }
  
  if (currentState.entropy > previousState.entropy * 1.2) {
    anomalies.push({
      timestamp: Date.now(),
      type: 'entropy_increase',
      description: 'Significant increase in system entropy detected.',
      severity: 0.6,
      affectedParticles: particles.length
    });
  }
  
  if (currentState.clusterCount > previousState.clusterCount * 1.5) {
    anomalies.push({
      timestamp: Date.now(),
      type: 'cluster_formation',
      description: 'Rapid cluster formation detected.',
      severity: 0.5,
      affectedParticles: particles.length
    });
  }
  
  return anomalies;
}

export function analyzeParticleClusters(particles: Particle[]) {
  if (particles.length === 0) {
    return {
      clusterCount: 0,
      averageClusterSize: 0,
      clusterLifetime: 0,
      clusterEntropyDelta: 0,
      informationDensity: 0,
      kolmogorovComplexity: 0
    };
  }
  
  // Placeholder implementation
  const clusterCount = Math.floor(Math.sqrt(particles.length));
  const averageClusterSize = particles.length / clusterCount;
  const clusterLifetime = Math.random() * 100;
  const clusterEntropyDelta = Math.random() * 0.2 - 0.1;
  const informationDensity = Math.random() * 2;
  const kolmogorovComplexity = Math.random() * 0.8;
  
  return {
    clusterCount,
    averageClusterSize,
    clusterLifetime,
    clusterEntropyDelta,
    informationDensity,
    kolmogorovComplexity
  };
}

export function calculateSystemEntropy(particles: Particle[], intentField: number[][][]) {
  if (particles.length === 0 || intentField.length === 0) {
    return {
      systemEntropy: 0,
      shannonEntropy: 0,
      spatialEntropy: 0,
      fieldOrderParameter: 0,
      temporalEntropy: 0
    };
  }
  
  // Placeholder implementation
  const systemEntropy = Math.random() * 0.9;
  const shannonEntropy = Math.random() * 0.7;
  const spatialEntropy = Math.random() * 0.6;
  const fieldOrderParameter = Math.random() * 0.5;
  const temporalEntropy = Math.random() * 0.4;
  
  return {
    systemEntropy,
    shannonEntropy,
    spatialEntropy,
    fieldOrderParameter,
    temporalEntropy
  };
}
