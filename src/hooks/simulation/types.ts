
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
