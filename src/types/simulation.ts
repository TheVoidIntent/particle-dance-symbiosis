
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

export interface SimulationStats {
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  totalInteractions: number;
  timestamp: number;
  robotCount?: number;
  clusterCount?: number;
  interactions?: number;
}
