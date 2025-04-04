
import { Particle, ParticleType } from '@/types/simulation';

/**
 * Simulation configuration type
 */
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

/**
 * Particle creation options type
 */
export interface ParticleCreationOptions {
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  charge?: 'positive' | 'negative' | 'neutral';
  type?: ParticleType;
  energy?: number;
  knowledge?: number;
  complexity?: number;
  intentValue?: number;
  isPostInflation?: boolean;
  // Add these additional properties to match usage in code
  maxVelocity?: number;
  maxIntent?: number;
  maxEnergy?: number;
  maxComplexity?: number;
}

/**
 * Inflation event type
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
}

/**
 * Intent field cell type
 */
export interface IntentFieldCell {
  x: number;
  y: number;
  z: number;
  value: number;
  lastUpdate: number;
  fluctuationRate: number;
}

/**
 * Simulation state type
 */
export interface SimulationState {
  particles: Particle[];
  intentField: number[][][];
  isRunning: boolean;
  simulationTime: number;
  interactionsCount: number;
  frameCount: number;
  dimensionWidth: number;
  dimensionHeight: number;
  isInflated: boolean;
  inflationTime: number | null;
  initialized: boolean;
}
