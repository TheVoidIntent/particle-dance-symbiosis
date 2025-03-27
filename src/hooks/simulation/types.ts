
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

export interface Particle {
  id: number; // Changed from string to number to match particleUtils.Particle
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  mass: number;
  charge: 'positive' | 'negative' | 'neutral';
  type: 'standard' | 'high-energy' | 'quantum' | 'composite' | 'adaptive';
  color: string;
  knowledge: number;
  complexity: number;
  intent: number;
  age: number;
  interactions: number;
  lastInteraction: number;
  isPostInflation?: boolean;
  scale?: number;
  // Added properties from particleUtils.Particle
  intentDecayRate: number;
  energy: number;
  energyCapacity: number;
  interactionCount: number;
  adaptiveScore?: number;
}

export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  dimensions: { width: number; height: number };
  originalDimensions: { width: number; height: number };
}

export interface InflationEvent {
  timestamp: number;
  intentInformation: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
}

// No re-exports here - these are already exported above
