
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

export interface SimulationState {
  particles: any[];
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
