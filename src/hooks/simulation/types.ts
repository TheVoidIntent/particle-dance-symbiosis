
import { Particle as BaseParticle } from '@/types/simulation';

// Re-export the Particle type to make it available to other files
export type Particle = BaseParticle;

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

export interface SimulationHookResult {
  particles: Particle[];
  intentField: number[][][];
  interactionsCount: number;
  simulationTime: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => Particle[];
  isRunning: boolean;
}

export interface ParticleCreationOptions {
  type?: string;
  charge?: string;
  maxVelocity?: number;
  maxIntent?: number;
  maxEnergy?: number;
  maxComplexity?: number;
  isPostInflation?: boolean;
}

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

export interface InflationEvent {
  timestamp: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
  expansionFactor?: number;
  fieldEnergyBefore?: number;
  fieldEnergyAfter?: number;
}

export interface NeuralIntentSimulationProps {
  particles: Particle[];
  isRunning: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  addParticles: (count: number) => void;
  createParticle: (x?: number, y?: number) => Particle;
  emergenceIndex: number;
  intentFieldComplexity: number;
  interactionCount: number;
  isTraining?: boolean;
  trainingProgress?: number;
  modelAccuracy?: number;
  insightScore?: number;
  predictedParticles?: Particle[];
  intentPredictions?: number[][][];
  neuralArchitecture?: string;
  startTraining?: () => void;
  generatePredictions?: () => void;
  toggleNeuralArchitecture?: () => void;
}
