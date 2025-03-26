
// Configuration settings for the mother simulation

export const defaultConfig = {
  maxParticles: 150,
  learningRate: 0.15,
  fluctuationRate: 0.02,
  useAdaptiveParticles: true,
  energyConservation: true,
  probabilisticIntent: true,
  viewMode: '2d' as '2d' | '3d',
};

// Simulation dimensions
export const simulationDimensions = {
  width: 800,
  height: 600,
  depth: 10,
};

// Field configuration
export const fieldConfig = {
  resolution: 10,
  get width() {
    return Math.ceil(simulationDimensions.width / this.resolution);
  },
  get height() {
    return Math.ceil(simulationDimensions.height / this.resolution);
  },
  depth: 10,
};

