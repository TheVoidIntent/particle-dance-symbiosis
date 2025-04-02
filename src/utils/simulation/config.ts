
// Configuration for the mother simulation

// Default configuration options
export const defaultConfig = {
  // Simulation parameters
  maxParticles: 200,
  maxInteractionRadius: 50,
  viewMode: '2d' as const,
  particleCreationRate: 0.3, // Probability of creating particles each tick
  particleLifetime: null, // null = infinite, or number of frames
  
  // Physics parameters
  baseSpeed: 1,
  dragFactor: 0.98,
  
  // Intent field parameters
  intentFluctuationRate: 0.01,
  probabilisticIntent: true,
  
  // Behavior parameters
  learningRate: 0.1,
  useAdaptiveParticles: true,
  energyConservation: false,
  
  // Rendering parameters
  renderMode: 'particles' as const, // 'particles', 'field', or 'both'
  showParticleDetails: true
};

// Dimensions for the simulation
export const simulationDimensions = {
  width: typeof window !== 'undefined' ? window.innerWidth : 800,
  height: typeof window !== 'undefined' ? window.innerHeight : 600
};

// Field configuration
export const fieldConfig = {
  width: 30, // Number of cells in x direction
  height: 20, // Number of cells in y direction
  depth: 5,  // Number of cells in z direction
  resolution: 20 // Size of each cell in pixels
};
