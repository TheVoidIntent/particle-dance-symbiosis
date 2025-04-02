import { Particle as ParticleType } from '@/utils/particleUtils';

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

// Export the Particle type explicitly
export type Particle = ParticleType;

export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  dimensions: { width: number; height: number };
  originalDimensions?: { width: number; height: number };
}

export interface InflationEvent {
  timestamp: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
  intentInformation: any;
}

export interface NeuralNetworkLayer {
  type: string;
  neurons?: number;
  activation?: string;
  filters?: number;
  kernelSize?: number;
  units?: number;
  returnSequences?: boolean;
  poolSize?: number;
  shape?: number[];
  outputDim?: number;
  heads?: number;
  dimModel?: number;
  dimFeedforward?: number;
}

export interface NeuralNetworkArchitecture {
  layers?: NeuralNetworkLayer[];
  generator?: NeuralNetworkLayer[];
  discriminator?: NeuralNetworkLayer[];
  description: string;
}

export interface NeuralNetworkInsight {
  score: number;
  metrics: {
    baseInsight: number;
    complexityContribution: number;
    diversityContribution: number;
    interactionDepth: number;
    architectureMultiplier: number;
  };
}
