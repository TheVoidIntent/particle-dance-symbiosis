
export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  charge: 'positive' | 'negative' | 'neutral';
  color: string;
  intent: number;
  knowledge: number;
  interactionTendency: number;
  lastInteraction: number;
  interactionCount: number;
}

export interface SimulationStats {
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
  shannonEntropy: number;
  spatialEntropy: number;
  fieldOrderParameter: number;
  clusterLifetime: number;
  clusterEntropyDelta: number;
  informationDensity: number;
  kolmogorovComplexity: number;
}

export interface SimulationDataPoint {
  timestamp: number;
  stats: SimulationStats;
}

export interface InflationEvent {
  timestamp: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
  fieldEntropyBefore: number;
  fieldEntropyAfter: number;
  duration: number;
}
