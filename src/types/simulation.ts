
export interface Particle {
  id?: string | number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vz?: number;
  radius: number;
  mass?: number;
  charge?: string;
  color: string;
  type: 'positive' | 'negative' | 'neutral' | string;
  intent?: number;
  energy?: number;
  knowledge?: number;
  complexity?: number;
  interactionTendency?: number;
  lastInteraction?: number;
  interactionCount?: number;
  z?: number;
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
  interactions?: number;
  totalInteractions?: number;
  frame?: number;
  time?: number;
  averageKnowledge?: number;
  complexityIndex?: number;
  systemEntropy?: number;
}
