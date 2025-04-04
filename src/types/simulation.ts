
// Simulation types

export interface Particle {
  id: string;
  x: number;
  y: number;
  z?: number;
  vx: number;
  vy: number;
  vz?: number;
  charge: 'positive' | 'negative' | 'neutral';
  size: number;
  radius?: number;
  color: string;
  knowledge: number;
  intent: number;
  age: number;
  type: string;
  isHighEnergy?: boolean;
  isPostInflation?: boolean;
  scale?: number;
  complexity?: number;
  interactions?: number;
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
  interactionCount?: number;
  frameCount?: number;
  isRunning?: boolean;
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
