/**
 * Particle interface for the simulation
 */
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
  color: string;
  type: string;
  intent: number;
  energy: number;
  knowledge: number;
  complexity: number;
  interactionTendency: number;
  lastInteraction?: number;
  interactionCount?: number;
  interactions: number;
  intentDecayRate?: number;
  energyCapacity?: number;
  created: number;
  isPostInflation?: boolean;
  scale: number;
  adaptiveScore?: number;
  age?: number;
  creationTime: number;
}

/**
 * Simulation statistics interface
 */
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
  timestamp?: number;
  frame?: number;
  time?: number;
  interactions?: number;
  robotCount?: number;
  // Add this if you need it elsewhere
  // fluctuationEvents?: number;
}

/**
 * Inflation event interface
 */
export interface InflationEvent {
  id: string;
  timestamp: number;
  particlesBefore: number;
  particlesAfter: number;
  inflationFactor: number;
  energyIncrease: number;
  complexityIncrease: number;
  narrative: string;
  particlesBeforeInflation?: Particle[];
  particlesAfterInflation?: Particle[];
  expansionFactor?: number;
}

/**
 * Cluster interface
 */
export interface Cluster {
  id: string;
  particles: Particle[];
  avgKnowledge: number;
  avgComplexity: number;
  charge: 'positive' | 'negative' | 'neutral' | 'mixed';
  size: number;
  formation: number;
  lastUpdate: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
}
