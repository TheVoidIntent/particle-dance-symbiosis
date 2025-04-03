
import { Particle } from '@/utils/particleUtils';

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

export interface InflationEvent {
  timestamp: number;
  particleCountBefore: number;
  particlesAfterInflation?: number;
  expansionFactor: number;
  particlesBeforeInflation?: number;
  particleCountAfter?: number;
}

export interface ParticleCreationOptions {
  type?: string;
  charge?: string;
  maxVelocity?: number;
  maxIntent?: number;
  maxEnergy?: number;
  maxComplexity?: number;
  isPostInflation?: boolean;
  x?: number;
  y?: number;
  eventType?: string;
}

export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  isRunning: boolean;
  simulationTime: number;
  interactionsCount: number;
  frameCount: number;
  isInflated: boolean;
  inflationTime: number | null;
  dimensions: { width: number; height: number };
}
