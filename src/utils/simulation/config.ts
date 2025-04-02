
// Configuration for the simulation
export const defaultConfig = {
  maxParticles: 100,
  initialParticleCount: 50,
  viewMode: '2d' as const,
  fluctuationRate: 0.01,
  learningRate: 0.1,
  particleCreationRate: 1,
  useAdaptiveParticles: false,
  energyConservation: false,
  probabilisticIntent: false,
};

// Simulation dimensions
export const simulationDimensions = {
  width: 800,
  height: 600,
};

// Intent field configuration
export const fieldConfig = {
  width: 40,
  height: 30,
  depth: 10,
  resolution: 20,
};

// Simulation options for rendering
export const simulationOptions = {
  gridSpacing: 40,
  fieldOpacity: 0.2,
  showGrid: true,
  showFields: true,
  showChargeColors: true,
};
