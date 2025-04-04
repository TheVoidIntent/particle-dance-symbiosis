// Simulation types

export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  charge: 'positive' | 'negative' | 'neutral';
  color: string;
  knowledge: number;
  intent: number;
  age: number;
  type: string;
  interactions: number;
  radius: number;
  mass: number;
  size: number;
  complexity: number;
  energy: number;
  interactionTendency: number;
  lastInteraction: number;
  interactionCount: number;
  created: number;
  creationTime: number;
  isPostInflation?: boolean;
  scale: number;
  adaptiveScore: number;
  intentDecayRate: number;
  energyCapacity: number;
  isHighEnergy?: boolean;
}

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
  interactionsCount?: number;
  interactionCount?: number;
  robotCount?: number;
  clusterCount?: number;
  highEnergyParticles?: number;
  quantumParticles?: number;
  compositeParticles?: number;
  adaptiveParticles?: number;
  complexityIndex?: number;
  averageKnowledge?: number;
  maxComplexity?: number;
  averageClusterSize?: number;
  systemEntropy?: number;
  intentFieldComplexity?: number;
  knowledgeAverage?: number;
  frameCount?: number;
  isRunning?: boolean;
  // Adding missing properties from errors
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  kolmogorovComplexity?: number;
  informationDensity?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
}

export interface ClusterData {
  id: number;
  particles: Particle[];
  center: { x: number; y: number };
  avgIntent: number;
  avgKnowledge: number;
  stability: number;
  complexity: number;
  age: number;
  narrative?: string;
}

export interface IntentFieldCell {
  x: number;
  y: number;
  z?: number;
  value: number;
  gradient: { x: number; y: number; z?: number };
}

export interface SimulationState {
  particles: Particle[];
  intentField: number[][];
  interactionsCount: number;
  frameCount: number;
  simulationTime?: number;
  isRunning?: boolean;
  intervalId?: number | null;
  emergenceIndex?: number;
  particleCount?: number;
  positiveParticles?: number;
  negativeParticles?: number;
  neutralParticles?: number;
  intentFieldComplexity?: number;
  knowledgeAverage?: number;
  type?: string;
  session?: any;
  notes?: string;
  timestamp?: string;
  duration?: number;
  audioData?: object;
}
