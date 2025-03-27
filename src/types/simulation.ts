
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
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
}

export interface SimulationDataPoint {
  timestamp: number;
  stats: SimulationStats;
}
