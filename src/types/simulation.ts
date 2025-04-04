
export type ParticleCharge = 'positive' | 'negative' | 'neutral';
export type ParticleType = 'regular' | 'high-energy' | 'quantum' | 'composite' | 'adaptive';

export interface Particle {
  id: string;
  x: number;
  y: number;
  z?: number;
  vx: number;
  vy: number;
  vz?: number;
  charge: ParticleCharge;
  radius: number;
  size?: number;
  mass: number;
  color: string;
  type?: ParticleType;
  intent?: number;
  energy?: number;
  knowledge?: number;
  complexity?: number;
  adaptability?: number;
  lastInteraction?: number;
  interactionCount?: number;
  age?: number;
  intentDecayRate?: number;
  created?: number;
  scale?: number;
  isPostInflation?: boolean;
  creationTime?: number;
  interactions?: number;
  interactionTendency?: number;
  adaptiveScore?: number;
  energyCapacity?: number;
}

export interface SimulationStats {
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  interactionRate?: number;
  averageKnowledge?: number;
  complexityIndex?: number;
  systemEntropy?: number;
  totalInteractions: number;
  emergenceIndex?: number;
  intentFieldComplexity?: number;
  interactionEfficiency?: number;
  frame?: number;
  time?: number;
  timestamp?: number;
  interactions?: number;
  robotCount?: number;
  clusterCount?: number;
}

export interface IntentField {
  resolution: number;
  data: number[][][];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface InteractionEvent {
  particle1Id: string;
  particle2Id: string;
  timestamp: number;
  energyExchanged: number;
  knowledgeExchanged: number;
  position: { x: number, y: number, z?: number };
}

export interface InflationEvent {
  timestamp: number;
  particleCount: number;
  energyLevel: number;
  description: string;
}

export interface Cluster {
  id: string;
  particles: Particle[];
  centroidX: number;
  centroidY: number;
  charge: ParticleCharge;
  size: number;
  complexity: number;
  knowledge: number;
  energy: number;
  formationTime: number;
  narratives?: Array<{ text: string, timestamp: number }>;
  intelligenceScore?: number;
}

export interface SimulationConfig {
  initialParticleCount: number;
  maxParticles: number;
  fieldResolution: number;
  intentFluctuationRate: number;
  interactionRadius: number;
  boundaryCondition: 'wrap' | 'bounce' | 'disappear';
  particleLifetime: number | null;
  inflationEnabled: boolean;
  inflationThreshold: number;
  inflationMultiplier: number;
}
