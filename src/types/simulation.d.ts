
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  charge: 'positive' | 'negative' | 'neutral';
  intent?: number;
  knowledge?: number;
  complexity?: number;
  energy?: number;
  age?: number;
  interactionTendency?: number;
  interactionCount?: number;
  interactions?: number;
  lastInteraction?: number;
  type?: 'standard' | 'high-energy' | 'quantum' | 'composite' | 'adaptive';
}

export interface SimulationStats {
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  highEnergyParticles: number;
  quantumParticles: number;
  compositeParticles: number;
  adaptiveParticles: number;
  totalInteractions: number;
  complexityIndex: number;
  averageKnowledge: number;
  maxComplexity: number;
  clusterCount: number;
  averageClusterSize: number;
  systemEntropy: number;
  intentFieldComplexity: number;
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
}
