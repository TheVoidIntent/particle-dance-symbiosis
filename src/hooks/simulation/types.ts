
import { Particle, AnomalyEvent } from '@/utils/particleUtils';

export interface SimulationConfig {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  useAdaptiveParticles?: boolean;
  energyConservation?: boolean;
  probabilisticIntent?: boolean;
}

export interface InflationEvent {
  timestamp: number;
  intentInformation: number;
  particlesBeforeInflation: number;
  particlesAfterInflation: number;
}

export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  dimensions: { width: number; height: number };
  originalDimensions: { width: number; height: number };
  interactions: number;
  frameCount: number;
  simulationTime: number;
  isAnimating: boolean;
  isInflated: boolean;
  inflationTime: number | null;
}
