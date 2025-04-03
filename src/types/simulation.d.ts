
export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  charge: 'positive' | 'negative' | 'neutral';
  color: string;
  type?: string;
  intent: number;
  energy: number;
  knowledge?: number;
  complexity?: number;
  interactionTendency: number;
  lastInteraction?: number;
  interactionCount?: number;
  interactions?: number;
  age?: number;
  intentDecayRate?: number;
  energyCapacity?: number;
  adaptiveScore?: number;
  creationTime: number;
  mass: number;
  created: number;
  scale: number;
  isPostInflation?: boolean;
}

export interface SimulationStats {
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  highEnergyParticles?: number;
  quantumParticles?: number;
  compositeParticles?: number;
  adaptiveParticles?: number;
  totalInteractions: number;
  complexityIndex?: number;
  averageKnowledge?: number;
  maxComplexity?: number;
  clusterCount?: number;
  averageClusterSize?: number;
  systemEntropy?: number;
  intentFieldComplexity?: number;
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
  robotCount?: number;
  timestamp?: number;
}

export interface SimulationConfig {
  initialParticleCount?: number;
  maxParticles?: number;
  fieldResolution?: number;
  intentFluctuationRate?: number;
  interactionRadius?: number;
  boundaryCondition?: 'wrap' | 'bounce' | 'disappear' | 'none';
  particleLifetime?: number | null;
  inflationEnabled?: boolean;
  inflationThreshold?: number;
  inflationMultiplier?: number;
}

export interface InflationEvent {
  id: string;
  timestamp: number;
  particlesBefore: number;
  particlesAfter: number;
  inflationFactor: number;
  energyIncrease: number;
  complexityIncrease: number;
  narrative: string;
  particleCountBefore?: number;
}
