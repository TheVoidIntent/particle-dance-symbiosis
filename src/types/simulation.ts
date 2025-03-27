
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
  temporalEntropy?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
}

export interface SimulationDataPoint {
  timestamp: number;
  stats: SimulationStats;
}

export interface ParticleCluster {
  id: number;
  particles: number[];
  center: { x: number; y: number; z: number };
  size: number;
  density: number;
  chargeBalance: number;
  complexity: number;
  creationTime: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  charge: 'positive' | 'negative' | 'neutral';
  type: 'standard' | 'high-energy' | 'quantum' | 'composite' | 'adaptive';
  mass: number;
  energy: number;
  complexity: number;
  knowledge: number;
  intent: number;
  color: string;
  created: number;
  lastInteraction: number;
  interactionCount: number;
  clusterId?: number;
  isPostInflation?: boolean;
  energyCapacity?: number;
  intentDecayRate?: number;
  scale?: number;
  adaptiveScore?: number;
}

export interface AnomalyEvent {
  type: string;
  timestamp: number;
  description: string;
  severity: number;
  affectedParticles: number;
  data?: any;
}

export interface InflationEvent {
  timestamp: number;
  intentInformation: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
}

export interface SimulationConfig {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  renderMode?: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles?: boolean;
  energyConservation?: boolean;
  probabilisticIntent?: boolean;
}

export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  dimensions: { width: number; height: number };
  originalDimensions: { width: number; height: number };
}

export interface SimulationControls {
  running: boolean;
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  renderMode: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles: boolean;
  energyConservation: boolean;
  probabilisticIntent: boolean;
  setRunning: (value: boolean) => void;
  setIntentFluctuationRate: (value: number) => void;
  setMaxParticles: (value: number) => void;
  setLearningRate: (value: number) => void;
  setParticleCreationRate: (value: number) => void;
  setViewMode: (value: '2d' | '3d') => void;
  setRenderMode: (value: 'particles' | 'field' | 'density' | 'combined') => void;
  setUseAdaptiveParticles: (value: boolean) => void;
  setEnergyConservation: (value: boolean) => void;
  setProbabilisticIntent: (value: boolean) => void;
}
