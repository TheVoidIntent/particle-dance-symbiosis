
// Define the basic particle interface
export interface Particle {
  id: number;
  x: number;
  y: number;
  z?: number;
  vx: number;
  vy: number;
  vz?: number;
  radius?: number;
  mass?: number;
  charge: 'positive' | 'negative' | 'neutral';
  color?: string;
  energy?: number;
  intent?: number;
  complexity?: number;
  isPostInflation?: boolean;
  knowledgeLevel?: number;
  lifetime?: number;
  interactionCount?: number;
  neighbours?: Particle[];
  type?: string;
}

// Define the simulation state
export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  interactionsCount: number;
  frameCount: number;
  simulationTime: number;
  isRunning: boolean;
  intervalId: number | null;
  dimensions?: { width: number; height: number };
  originalDimensions?: { width: number; height: number };
}

// Define simulation configuration
export interface SimulationConfig {
  initialParticleCount: number;
  maxParticles: number;
  fieldResolution: number;
  intentFluctuationRate: number;
  interactionRadius: number;
  boundaryCondition: 'wrap' | 'bounce' | 'none';
  particleLifetime: number | null;
  inflationEnabled: boolean;
  inflationThreshold: number;
  inflationMultiplier: number;
}

// Define inflation event interface
export interface InflationEvent {
  timestamp: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
  expansionFactor?: number;
  fieldEnergyBefore?: number;
  fieldEnergyAfter?: number;
}

// Define Neural Intent Simulation properties
export interface NeuralIntentProps {
  isTraining: boolean;
  trainingProgress: number;
  modelAccuracy: number;
  insightScore: number;
  predictedParticles: Particle[];
  intentPredictions: number[][][];
  neuralArchitecture: string;
  startTraining: () => void;
  generatePredictions: () => void;
  toggleNeuralArchitecture: () => void;
}
