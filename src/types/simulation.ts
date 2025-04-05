
export type ParticleType = 'regular' | 'high-energy' | 'quantum' | 'composite' | 'adaptive' | 'standard';

export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  mass: number;
  charge: 'positive' | 'negative' | 'neutral';
  type: ParticleType;
  color?: string;
  size?: number;
  interactionTendency: number;
  knowledge: number;
  complexity: number;
  intentValue?: number;
  intent?: number;
  energy: number;
  interactions: number;
  lastInteraction: number;
  clusterID: string | null;
  age: number;
  scale?: number;
  adaptiveScore?: number;
  creationTime?: number;
  isPostInflation?: boolean;
  interactionCount?: number;
  intentDecayRate?: number;
  energyCapacity?: number;
  created?: number;
}

/**
 * Simulation statistics interface with all required properties
 */
export interface SimulationStats {
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  totalInteractions: number;
  timestamp?: number;
  frame?: number;
  time?: number;
  interactions?: number;
  robotCount?: number;
  clusterCount?: number;
  
  // Additional properties that were causing errors
  highEnergyParticles?: number;
  quantumParticles?: number;
  compositeParticles?: number;
  adaptiveParticles?: number;
  averageKnowledge?: number;
  complexityIndex?: number;
  systemEntropy?: number;
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  kolmogorovComplexity?: number;
  averageClusterSize?: number;
  informationDensity?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  intentFieldComplexity?: number;
}
